import React, { FC, useState } from "react";
import {Container, Row, Form, Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import { _toast } from "../../utils";
import { testCmds, cmdNames } from "../../utils/const";

const Test = () => {
  const defaultTeams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [activeTeams, setActiveTeams] = useState<Array<number>>([]);
  const [activeCommands, setActiveCommands] = useState<Array<string>>([]);
  const addToActiveTeamList = (team: number) => {
    let arr = activeTeams.slice();
    arr.push(team);
    setActiveTeams(arr);
  };
  const removeFromActiveTeamList = (team: number) => {
    let arr = activeTeams.filter((val, index, arr) => { return val != team; });
    setActiveTeams(arr);
  };
  const addAll = (event: React.MouseEvent) => { setActiveTeams(defaultTeams.slice()); }
  const removeAll = (event: React.MouseEvent) => { setActiveTeams([]); }
  return (
    <div className="test-page">
      <h2 className="mb-5">팀포크봇 테스트페이지</h2>
      <div className="inner">
        <div className="mb-3">
          <Button variant="primary" className="me-2" onClick={addAll}>모두선택</Button>
          <Button variant="secondary" onClick={removeAll}>모두선택해제</Button>
        </div>
        <div className="mb-3">
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup className="me-2" aria-label="First group">
              {defaultTeams.map((team: number, index) => {
                let isActive = activeTeams.includes(team);
                return <Button
                  key={team}
                  variant={isActive ? "primary" : "secondary"}
                  onClick={isActive ? (event) => {removeFromActiveTeamList(team);} : (event) => {addToActiveTeamList(team);}}
                  >{team + "팀"}</Button>
              })}
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div>
          {cmdNames.map((name: string) => {
            let cmd = (testCmds as any)[name];
            let isActive = activeCommands.includes(name);
            return <Button 
              key={name}
              variant={isActive ? "success" : "secondary"}
              className="me-2"
              onClick={(event: React.MouseEvent) => {
                activeTeams.map((team: number) => {
                  let t = team < 10 ? '0'+team : team;
                  let code = isActive ? cmd.stop : cmd.code;
                  let url = `http://voice-car-${t}.jp.ngrok.io/${code}/${cmd.speed}`;
                  fetch(url);
                });
                let arr = activeCommands.slice();
                if (!isActive) arr.push(name);
                else arr = arr.filter((_name: string) => { return name != _name });
                console.log("activeCommands : ", arr);
                setActiveCommands(arr);
              }}>{cmd.nameKR}</Button>
          })}
        </div>
      </div>
    </div>
  )
}

export default Test;
