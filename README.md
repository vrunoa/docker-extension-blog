# docker-extension-blog

Get the latest news, tips and tricks about Docker with this extension

<img src="screen-recording.gif" width="100%" />

## Install

```bash
docker extension install vrunoa/docker-extension-blog:v0.0.6
```

## Development

Installing the extension
```bash
make install-extension
```

Enable devtools console
```bash
docker extension dev debug vrunoa/docker-extension-blog
```

Enable ui development
```bash
docker extension dev ui-source vrunoa/docker-extension-blog http://localhost:3000
```

Reset debug
```bash
docker extension dev reset vrunoa/docker-extension-blog
```