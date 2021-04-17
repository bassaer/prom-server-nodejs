import cluster from 'cluster';
import express from 'express';
import os from 'os';
import { AggregatorRegistry, Counter } from 'prom-client';

if (cluster.isMaster) {
	for (let i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}
	const metricsServer = express();
	const aggregatorRegistry = new AggregatorRegistry();
	metricsServer.get('/cluster_metrics', async (req, res) => {
		try {
			const metrics = await aggregatorRegistry.clusterMetrics();
			res.set('Content-Type', aggregatorRegistry.contentType);
			res.send(metrics);
		} catch (error) {
			res.statusCode = 500;
			res.send(error.message);
		}

	});
	metricsServer.listen(3001);
} else {
	const app = express();
	const counter = new Counter({
		name: 'req_counter',
		help: 'request count',
		labelNames: ['code']
	})
	app.get('/hoge', (req, res, next) => {
		counter.inc({ code: 'hoge' });
		res.send('hoge');
	});
	app.get('/piyo', (req, res, next) => {
		counter.inc({ code: 'piyo' });
		res.send('piyo');
	});
	app.listen(3000, () => {
		console.log(`start: ${process.pid}`);
	});
}
