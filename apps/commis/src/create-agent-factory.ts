import { EventType, type StateDeltaEvent } from '@ag-ui/core';
import {
  convertAISDKStream,
  type BuiltInAgentCustomFactoryConfig,
} from '@copilotkit/runtime/v2';
import { compare } from 'fast-json-patch';

type CustomAgentFactoryContext = Parameters<
  BuiltInAgentCustomFactoryConfig['factory']
>[0];

export type CreateAgentFactoryContext = CustomAgentFactoryContext & {
  emitState: (partialState: Record<string, unknown>) => void;
};

type StreamTextLike = {
  fullStream: AsyncIterable<unknown>;
};

export function createAgentFactory(
  factory: (
    ctx: CreateAgentFactoryContext,
  ) => StreamTextLike | Promise<StreamTextLike>,
): BuiltInAgentCustomFactoryConfig['factory'] {
  return async function* (ctx) {
    const pendingStateChanges: StateDeltaEvent[] = [];
    let currentState: Record<string, unknown> = {
      ...(ctx.input.state as Record<string, unknown>),
    };

    const emitState = (partialState: Record<string, unknown>) => {
      const nextState = { ...currentState, ...partialState };
      pendingStateChanges.push({
        type: EventType.STATE_DELTA,
        delta: compare(currentState, nextState),
      });
      currentState = nextState;
    };

    const result = await factory({ ...ctx, emitState });

    for await (const event of convertAISDKStream(
      result.fullStream,
      ctx.abortSignal,
    )) {
      yield event;
    }

    for (const change of pendingStateChanges) {
      yield change;
    }
  };
}
