# prom-server-nodejs

```
❯ curl localhost:3000/hoge
hoge

❯ curl localhost:3000/piyo
piyo
```
```
❯ curl localhost:3001/cluster_metrics
# HELP req_counter request count
# TYPE req_counter counter
req_counter{code="piyo"} 1
req_counter{code="hoge"} 1
```
