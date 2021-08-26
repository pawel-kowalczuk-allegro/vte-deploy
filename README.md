# allegro-actions/vte-deploy

example:

```yaml

steps:
  - uses: allegro-actions/vte-deploy@v1
    with:
      host: company.system.allegro
      identity: green-planet
      username: ${{ secrets.LUNA_USERNAME }}
      password: ${{ secrets.LUNA_PASSWORD }}
      name: opbox-core
      group: pl.allegro.opbox
      version: 1.0.0-SNAPSHOT
```