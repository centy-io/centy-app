import { createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { CentyDaemon } from '../gen/centy_pb.ts'

const DAEMON_URL = import.meta.env.VITE_DAEMON_URL || 'http://localhost:50051'

const transport = createGrpcWebTransport({
  baseUrl: DAEMON_URL,
})

export const centyClient = createClient(CentyDaemon, transport)
