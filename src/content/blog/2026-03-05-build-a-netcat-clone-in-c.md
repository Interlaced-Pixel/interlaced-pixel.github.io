---
title: "Build Your Own Netcat in Pure C"
date: 2026-03-05 09:00:00 -0600
author: "Jayian"
categories: tutorial
---

If you've spent any time in a terminal, you've probably typed `nc` — or cursed the fact that it wasn't there. Netcat is the Swiss Army knife of networking: you can pipe data through it, scan ports, chat between machines, and exfiltrate files, all without installing a thing.

But what actually *lives* inside it?

Today we're peeling back the curtain and building a minimal, fully functional netcat clone from scratch — in pure C, with zero dependencies, zero external libraries, and under 80 lines of code.

## The Core Idea

`nc` does two things:

1. **Connect mode**: Opens a TCP connection to a host and forwards `stdin`/`stdout` through it.
2. **Listen mode**: Binds a port and accepts an incoming connection, then does the same thing.

Both modes reduce to the same primitive: **bidirectional data relay between a file descriptor and a socket**. Once you see it that way, the implementation almost writes itself.

## Step 1 — Scaffolding

Create a file called `nc_mini.c`. We'll need exactly four headers:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
```

No `libpcap`. No `libevent`. Nothing exotic. These are POSIX — available everywhere from a Raspberry Pi to a mainframe.

## Step 2 — The Relay Engine

The heart of the program is a relay loop. We need to watch *two* file descriptors at once — the socket and `stdin` — and copy data in both directions the moment bytes arrive. The POSIX `select()` call is perfect for this:

```c
static void relay(int sock) {
    char buf[4096];
    fd_set fds;

    for (;;) {
        FD_ZERO(&fds);
        FD_SET(STDIN_FILENO, &fds);
        FD_SET(sock, &fds);

        if (select(sock + 1, &fds, NULL, NULL, NULL) < 0)
            break;

        if (FD_ISSET(STDIN_FILENO, &fds)) {
            ssize_t n = read(STDIN_FILENO, buf, sizeof(buf));
            if (n <= 0) break;
            write(sock, buf, (size_t)n);
        }

        if (FD_ISSET(sock, &fds)) {
            ssize_t n = read(sock, buf, sizeof(buf));
            if (n <= 0) break;
            write(STDOUT_FILENO, buf, (size_t)n);
        }
    }
}
```

`select()` blocks until *at least one* descriptor has data. When `stdin` fires, we write to the socket. When the socket fires, we write to `stdout`. When either end closes (`n <= 0`), we break out and the program exits cleanly.

## Step 3 — Connect Mode

Connecting to a remote host is the easy path. We resolve the hostname with `getaddrinfo()`, create a socket, and call `connect()`:

```c
static int do_connect(const char *host, uint16_t port) {
    struct addrinfo hints = {0}, *res;
    hints.ai_family   = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    char port_str[6];
    snprintf(port_str, sizeof(port_str), "%u", port);

    if (getaddrinfo(host, port_str, &hints, &res) != 0)
        return -1;

    int fd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (fd < 0) { freeaddrinfo(res); return -1; }

    if (connect(fd, res->ai_addr, res->ai_addrlen) != 0) {
        close(fd);
        freeaddrinfo(res);
        return -1;
    }

    freeaddrinfo(res);
    return fd;
}
```

`AF_UNSPEC` means we handle both IPv4 and IPv6 transparently — the OS picks the right family based on the resolved address.

## Step 4 — Listen Mode

Listen mode is only a handful of lines more. We bind a socket, mark it with `SO_REUSEADDR` (so you don't have to wait for `TIME_WAIT` to expire if you restart quickly), and block on `accept()`:

```c
static int do_listen(uint16_t port) {
    int srv = socket(AF_INET6, SOCK_STREAM, 0);
    if (srv < 0) return -1;

    int yes = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

    /* IPV6_V6ONLY=0 lets the same socket accept IPv4 connections too */
    int no = 0;
    setsockopt(srv, IPPROTO_IPV6, IPV6_V6ONLY, &no, sizeof(no));

    struct sockaddr_in6 addr = {0};
    addr.sin6_family = AF_INET6;
    addr.sin6_addr   = in6addr_any;
    addr.sin6_port   = htons(port);

    if (bind(srv, (struct sockaddr *)&addr, sizeof(addr)) < 0 ||
        listen(srv, 1) < 0) {
        close(srv);
        return -1;
    }

    int client = accept(srv, NULL, NULL);
    close(srv); /* stop accepting further connections */
    return client;
}
```

We bind to `in6addr_any` with `IPV6_V6ONLY` disabled, which gives us a dual-stack socket that accepts both IPv4 and IPv6 connections on the same port.

## Step 5 — The `main` Entry Point

Wire everything together with a simple argument parser:

```c
int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s [-l] <port> [host]\n", argv[0]);
        return 1;
    }

    int listen_mode = (strcmp(argv[1], "-l") == 0);
    int fd = -1;

    if (listen_mode && argc >= 3) {
        fd = do_listen((uint16_t)atoi(argv[2]));
    } else if (!listen_mode && argc >= 3) {
        fd = do_connect(argv[1], (uint16_t)atoi(argv[2]));
    } else {
        fprintf(stderr, "usage: %s [-l] <port> [host]\n", argv[0]);
        return 1;
    }

    if (fd < 0) {
        perror("connection failed");
        return 1;
    }

    relay(fd);
    close(fd);
    return 0;
}
```

## Step 6 — Build & Run

```bash
cc -Wall -Wextra -o nc_mini nc_mini.c
```

That's a single compiler invocation. No `Makefile`, no `CMakeLists.txt`, no nothing.

**Chat between two terminals on the same machine:**

```bash
# Terminal 1 — server
./nc_mini -l 4444

# Terminal 2 — client
./nc_mini localhost 4444
```

Type in either window and the text appears in the other. Press `Ctrl+D` to close the connection.

**Transfer a file across the network:**

```bash
# Receiver
./nc_mini -l 9000 > received_file.bin

# Sender
./nc_mini 192.168.1.42 9000 < large_archive.tar.gz
```

No SCP. No FTP. Just raw TCP doing what TCP does.

## Why This Matters

A 70-line `nc` clone is not a toy. It demonstrates exactly why C is still the *lingua franca* of systems programming: POSIX sockets are one thin abstraction over the kernel's network stack, and the syscall overhead of a 1 GiB file transfer through `nc_mini` is negligible — the bottleneck is always your NIC, not the code.

Once you understand this pattern, building a reverse proxy, a load balancer, or a protocol fuzzer is just a matter of adding logic between the two `read/write` pairs.

The full source is available below. Go break something with it.

---

<div class="card-action">
  <p>Want to go deeper? Check out our high-performance HTTP server built on the same primitives.</p>
  <a href="https://github.com/Interlaced-Pixel/http-c" class="btn">Explore http-c on GitHub</a>
</div>
