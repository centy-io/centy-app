import type { DescMessage, MessageShape } from '@bufbuild/protobuf'

export type GrpcHandler<Req extends DescMessage, Res extends DescMessage> = (
  request: MessageShape<Req>
) => MessageShape<Res> | Promise<MessageShape<Res>>

export interface HandlerConfig<
  Req extends DescMessage,
  Res extends DescMessage,
> {
  requestSchema: Req
  responseSchema: Res
  handler: GrpcHandler<Req, Res>
}
