import React, { Fragment, useEffect, useState } from "react";
import { Card, Form, Button, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { _toast } from "../../../utils";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { fetchTeamCommands } from "../../../redux/features/commandTableSlice";
import { VC } from "../../../utils/types";
import { ErrorMessages, defaultCommands } from "../../../utils/const";
import { unwrapResult } from "@reduxjs/toolkit";

const CommandTable = ({}) => {
  const dispatch = useAppDispatch();
  useEffect(() => { 
    dispatch(fetchTeamCommands());
  }, []);
  const {
    teamCommands,
    fetchPending, fetchError,
    updatePending, updateError
  } = useAppSelector((state: RootState) => state.teamCommands);
  let keys = ['handOpen', 'handClose', 'elbowOpen', 'elbowClose', 'shoulderOpen', 'shoulderClose', 'waistLeft', 'waistRight', 'bottomGo', 'bottomGoFast', 'bottomLeft', 'bottomRight', 'bottomBack'];

  let krNames = keys.map((key, index) => { 
    let name = (defaultCommands as any)[key]['nameKR'];
    return name;
  });
  let $tableHeader = krNames.map((nameKR, index) => { return <th key={index}>{nameKR}</th>; });
  let $tables = teamCommands.map((tcmd) => {
    let { team, commands } = tcmd;
    let speeds: number[] = [];
    let similarWords: string[] = [];
    keys.map((key, index) => {
      let cmd = (commands as any)[key];
      speeds.push(cmd['speed']);
      let sw = cmd['similarWords'];
      similarWords.push(sw.join());
    });
    return (
      <Table key={team} striped bordered hover className="command-table">
        <thead>
          <tr>
            <th>{team}팀</th>
            {$tableHeader}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>속도값</b></td>
            {
              speeds.map((s, index) => {
                let k = s+''+index;
                return <td key={k}>{s}</td>
              })
            }
          </tr>
          <tr>
            <td><b>유사명령어</b></td>
            {
              similarWords.map((sw, index) => {
                return <td key={index}>{sw}</td>
              })
            }
          </tr>
        </tbody>
      </Table>
    )
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>팀별 명령어 정보</Card.Title>
        <div className="command-table-container">
          {$tables}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommandTable;