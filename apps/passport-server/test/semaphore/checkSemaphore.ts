import { deserializeSemaphoreGroup } from "@pcd/semaphore-group-pcd";
import { expect } from "chai";
import { fetchLatestHistoricSemaphoreGroups } from "../../src/database/queries/historicSemaphore";
import { PCDpass } from "../../src/types";

export interface SemaphoreGroups {
  p: string[]; // participants
  r: string[]; // residents
  v: string[]; // visitors
  o: string[]; // organizers
  g: string[]; // generic
}

export function expectGroupsEqual(
  lhs: SemaphoreGroups,
  rhs: SemaphoreGroups
): void {
  expect(new Set(...lhs.p)).to.deep.eq(new Set(...rhs.p));
  expect(new Set(...lhs.r)).to.deep.eq(new Set(...rhs.r));
  expect(new Set(...lhs.v)).to.deep.eq(new Set(...rhs.v));
  expect(new Set(...lhs.o)).to.deep.eq(new Set(...rhs.o));
  expect(new Set(...lhs.g)).to.deep.eq(new Set(...rhs.g));
}

export function expectCurrentSemaphoreToBe(
  application: PCDpass,
  expected: SemaphoreGroups
): void {
  const currentSemaphore = getCurrentSemaphoreServiceGroups(application);
  expectGroupsEqual(currentSemaphore, expected);
}

export async function testLatestHistoricSemaphoreGroups(
  application: PCDpass
): Promise<void> {
  const currentSemaphoreGroups = getCurrentSemaphoreServiceGroups(application);

  const latestHistoricSemaphoreGroups =
    await getLatestHistoricalSemaphoreGroups(application);

  expectGroupsEqual(latestHistoricSemaphoreGroups, currentSemaphoreGroups);
}

function getCurrentSemaphoreServiceGroups(
  application: PCDpass
): SemaphoreGroups {
  return {
    g: application.services.semaphoreService
      .groupPCDpass()
      .group.members.map((m) => m.toString()),
    v: application.services.semaphoreService
      .groupVisitors()
      .group.members.map((m) => m.toString()),
    o: application.services.semaphoreService
      .groupOrganizers()
      .group.members.map((m) => m.toString()),
    p: application.services.semaphoreService
      .groupParticipants()
      .group.members.map((m) => m.toString()),
    r: application.services.semaphoreService
      .groupResidents()
      .group.members.map((m) => m.toString())
  };
}

async function getLatestHistoricalSemaphoreGroups(
  application: PCDpass
): Promise<SemaphoreGroups> {
  const latestGroups = await fetchLatestHistoricSemaphoreGroups(
    application.context.dbPool
  );

  const parsedLatestGroups = latestGroups.map((g) =>
    deserializeSemaphoreGroup(JSON.parse(g.serializedGroup))
  );

  return {
    p:
      parsedLatestGroups
        .find((g) => g.id.toString() === "1")
        ?.members?.map((m) => m.toString()) ?? [],
    r:
      parsedLatestGroups
        .find((g) => g.id.toString() === "2")
        ?.members?.map((m) => m.toString()) ?? [],
    v:
      parsedLatestGroups
        .find((g) => g.id.toString() === "3")
        ?.members?.map((m) => m.toString()) ?? [],
    o:
      parsedLatestGroups
        .find((g) => g.id.toString() === "4")
        ?.members?.map((m) => m.toString()) ?? [],
    g:
      parsedLatestGroups
        .find((g) => g.id.toString() === "5")
        ?.members?.map((m) => m.toString()) ?? []
  };
}
