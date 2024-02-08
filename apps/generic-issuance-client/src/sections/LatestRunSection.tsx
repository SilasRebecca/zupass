import { PipelineLog, PipelineRunInfo } from "@pcd/passport-interface";
import moment from "moment";
import { ReactNode } from "react";
import styled from "styled-components";

/**
 * Renders information about the last time this pipeline was run by PodBox.
 * Useful for debugging an integration, and figuring out what went wrong.
 */
export function LatestRunSection({
  latestRun
}: {
  latestRun: PipelineRunInfo;
}): ReactNode {
  const startDate = new Date(latestRun.lastRunStartTimestamp);
  const endDate = new Date(latestRun.lastRunStartTimestamp);
  const durationMs =
    latestRun.lastRunStartTimestamp - latestRun.lastRunStartTimestamp;

  return (
    <div>
      <h3>Last Run</h3>
      <Table>
        <tbody>
          <tr>
            <td>start</td>
            <td>{moment(startDate).format("MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
          <tr>
            <td>end</td>
            <td>{moment(endDate).format("MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
          <tr>
            <td>duration</td>
            <td>{durationMs}ms</td>
          </tr>
          <tr>
            <td>datas loaded</td>
            <td>{latestRun.atomsLoaded}</td>
          </tr>
          <tr>
            <td>success</td>
            <td>{latestRun.success.toString()}</td>
          </tr>
        </tbody>
      </Table>

      <h3>Logs</h3>
      {latestRun.latestLogs.length === 0 ? (
        <>
          <div>no logs</div>
        </>
      ) : (
        <Table>
          {latestRun.latestLogs.map((l, i) => (
            <PipelineLogEntry log={l} key={i} />
          ))}
        </Table>
      )}
    </div>
  );
}

export function PipelineLogEntry({ log }: { log: PipelineLog }): ReactNode {
  return (
    <tr>
      <td>{moment(log.timestampCreated).format("MMMM Do YYYY, h:mm:ss a")}</td>
      <td>{log.level}</td>
      <td>{log.value}</td>
    </tr>
  );
}

const Table = styled.table`
  border-collapse: collapse;

  tr {
    td {
      padding: 4px 8px;
      border: 1px solid white;
    }
    td:first-child {
      text-align: left;
    }
    td:last-child {
      text-align: right;
    }
  }
`;