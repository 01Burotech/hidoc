import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

let sdk: NodeSDK;

export const initTracing = async () => {
  if (sdk) return; // éviter ré-initialisation

  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  });

  sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdk.start();
  console.log('[Tracing] OpenTelemetry initialized');

  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    console.log('[Tracing] OpenTelemetry shutdown complete');
    process.exit(0);
  });
};
