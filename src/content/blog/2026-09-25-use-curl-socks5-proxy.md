---
title: "How to Use curl with a SOCKS5 Proxy: Local vs. Remote DNS"
description: "Route curl through a SOCKS5 proxy, choose where DNS lookups happen, verify the connection, and troubleshoot common errors without overstating what a proxy protects."
date: 2026-09-25 09:00:00 -0500
author: "Jayian"
categories: tutorial
---

To send a `curl` request through a SOCKS5 proxy, pass the proxy URL with `--proxy`:

```bash
curl --proxy socks5h://127.0.0.1:1080 https://example.com/
```

This example assumes a SOCKS5 server is already listening on `127.0.0.1:1080`. Replace that address and port with the ones your proxy provides. The `h` in `socks5h` matters: it asks the proxy to resolve the destination hostname. Use `socks5://` when you want `curl` to resolve the hostname locally first.

## `socks5` vs. `socks5h`: where DNS happens

The choice controls which machine looks up the destination name:

| Proxy URL | Destination DNS lookup |
| --- | --- |
| `socks5://proxy-host:1080` | Your machine resolves the destination, then sends its address through the proxy. |
| `socks5h://proxy-host:1080` | The proxy receives the destination hostname and resolves it. |

For example, these two commands use different DNS paths:

```bash
# Resolve example.com on this machine
curl --proxy socks5://127.0.0.1:1080 https://example.com/

# Ask the SOCKS proxy to resolve example.com
curl --proxy socks5h://127.0.0.1:1080 https://example.com/
```

Use remote resolution when the proxy network should handle destination DNS, such as when the destination is only resolvable from that network. Use local resolution when you specifically want your machine to look up the name before connecting. Remote DNS changes where the lookup is performed; it does not, by itself, encrypt DNS or make the entire connection private.

The equivalent dedicated option is `--socks5-hostname`:

```bash
curl --socks5-hostname 127.0.0.1:1080 https://example.com/
```

The port is part of the proxy address. SOCKS commonly uses port `1080`, but use the port configured by your server or provider. `curl` also accepts a hostname for the proxy itself, for example `socks5h://proxy.example.net:7000`.

## Check that curl is using the proxy

Add `--verbose` to see the connection setup and proxy negotiation:

```bash
curl --verbose --proxy socks5h://127.0.0.1:1080 https://example.com/
```

Look for `curl` connecting to the proxy address and completing the SOCKS handshake before it makes the HTTPS request. Verbose output is useful for troubleshooting, but can include hostnames, addresses, and other connection details; review it before sharing logs.

If you are using a proxy you control, check its own connection log as well. A successful HTTP response alone does not prove which DNS resolver was used. Avoid sending sensitive requests to a public “what is my IP” service just to test a proxy; use a destination and proxy you trust.

## Common errors and fixes

### `Connection refused` or a timeout

`curl` cannot establish a TCP connection to the proxy. Confirm the proxy is running, the host and port are correct, and local firewall or network rules allow the connection. A timeout can also mean the proxy is reachable only from a different network.

### The SOCKS handshake fails

Check that the endpoint speaks SOCKS5 and that any required authentication is configured correctly. A normal HTTP proxy is not interchangeable with a SOCKS proxy. If credentials are required, follow the provider's documented method and avoid placing secrets in shell history or shared command logs.

### The proxy connects, but the hostname does not

Try the other DNS mode. `socks5h://` delegates destination-name resolution to the proxy; `socks5://` resolves it on the client. If one mode works and the other does not, the issue may be which resolver can see that hostname, rather than basic proxy connectivity.

### A proxy environment variable is interfering

`curl` can read proxy settings from environment variables such as `ALL_PROXY`. Inspect the environment if a request unexpectedly uses a proxy or bypasses one. For a one-command test, specify the intended proxy explicitly with `--proxy`. A `NO_PROXY` setting can also exempt matching destinations; `--noproxy` controls that exclusion for a command.

## What a SOCKS5 proxy does—and does not—protect

SOCKS5 is a way to relay network connections. It is not an encryption layer for the connection between your computer and the proxy. A proxy operator can generally see that you connected to it and may see destination and traffic metadata.

When the destination uses HTTPS, TLS protects the HTTP request and response contents between `curl` and the destination server, assuming certificate verification remains enabled. The proxy relays that encrypted connection but is not a substitute for HTTPS. Do not use `--insecure` (`-k`) to silence certificate errors: that disables an important check.

SOCKS5 also supports more than web browsing, including UDP association in the protocol. This `curl` example is an HTTP or HTTPS request carried over a TCP connection; it does not turn `curl` into a general UDP tunnel.

## Quick reference

```bash
# SOCKS5, with destination DNS resolved locally
curl --proxy socks5://127.0.0.1:1080 https://example.com/

# SOCKS5, with destination DNS resolved by the proxy
curl --proxy socks5h://127.0.0.1:1080 https://example.com/

# Show connection and proxy negotiation details
curl --verbose --proxy socks5h://127.0.0.1:1080 https://example.com/
```

For the exact options and protocol details, see the [curl manual](https://curl.se/docs/manpage.html), [curl's proxy option documentation](https://curl.se/libcurl/c/CURLOPT_PROXY.html), and [RFC 1928, the SOCKS Protocol Version 5 specification](https://www.rfc-editor.org/rfc/rfc1928.html). If you are experimenting with a small self-hosted implementation, our [SOCKS5 proxy project](/projects/) is one example of the kind of server these commands can connect to.
