import React, { useState, useEffect } from "react";
import { Card, Form, Row, InputGroup, FormControl, Col, Button } from "react-bootstrap";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { useForm } from "react-hook-form";
import { VC } from "../../../utils/types";
import { _toast } from "../../../utils";
import { ErrorMessages, defaultTeams } from "../../../utils/const";
import { fetchAllTeamPasswords, updateTeamPasswords } from "../../../redux/features/teamPasswordSlice";
import * as _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const TeamPasswords = ({}) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setValue, watch, formState: { errors }, setError, reset } = useForm<VC.TeamPassword[]>();
  useEffect(() => {
    dispatch(fetchAllTeamPasswords());
  }, []);
  const {
    teamPasswords,
    fetchError, fetchPending,
    updateError, updatePending
  } = useAppSelector((state: RootState) => state.teamPasswords);

  if (fetchError) {
    toast.error(fetchError.message);
  } else if (updateError) {
    toast.error(updateError.message);
  }

  const onSubmit = (data: {[index: number]: VC.TeamPassword}) => {
    const arr = (Object.values(data).filter(({team, password}) => password.length > 0))
                  .map(({team, password}) => { return { team: Math.floor(team), password } });

    // validation - 아무것도 입력 안했을때
    if (arr.length === 0) {
      _toast.error(ErrorMessages.TEAM_PASSWORD_EMPTY);
      return;
    }
    
    // validation - 특수문자(special characters) 및 스페이스바 포함 여부
    const scErrorFields = arr.filter(({ team, password }) => {
      const space = /\s/gi;
      const sc = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
      if (space.test(password) || sc.test(password)) {
        setError(`${team-1}.password` as const, {
          type: 'pattern',
          message: ErrorMessages.TEAM_PASSWORD_SPECIAL_CHARACTERS
        });
        return true;
      }
      return false;
    });
    if (scErrorFields.length > 0) {
      _toast.error(ErrorMessages.TEAM_PASSWORD);
      return;
    }

    // validation - prefix(ab) error
    // const prefixErrorFields = arr.filter(tp => {
      // const { team, password } = tp;
      // 비밀번호의 길이가 0이면 입력 안한거니까 이거는 a혹은 b로 시작 안하는게 아니라, 그냥 검사 대상이 아닌거다.
      // if (password.length == 0) return false;
    //   const regex = /^[a|b]/gi;
    //   if (!regex.test(password)) {
    //     setError(`${team-1}.password` as const, {
    //       type: 'pattern',
    //       message: ErrorMessages.TEAM_PASSWORD_PREFIX
    //     });
    //     return true;
    //   }
    //   return false;
    // });
    // if (prefixErrorFields.length > 0) {
    //   _toast.error(ErrorMessages.TEAM_PASSWORD);
    //   return;
    // }

    // validation - duplication
    const _teamPasswords: VC.TeamPassword[] = teamPasswords.map(tp => {
      const t = tp.team;
      let p = tp.password;
      arr.forEach(({ team, password }) => {
        if (t === team) p = password;
      });
      return {team: t, password: p};
    });

    // arr를 filtering하는 이유 : 방금 입력한 input field에만 error를 표시하기 위해서!
    const duplicatedFields = arr.filter(tp => {
      if (tp.password.length < 1) return false;
      let duplicated = false;
      _teamPasswords.forEach(({team, password}) => {
        if ((tp.team !== team) && (tp.password === password)) duplicated = true;
      });
      if (duplicated) {
        setError(`${tp.team-1}.password` as const, {
          type: 'duplication',
          message: ErrorMessages.TEAM_PASSWORD_DUPLICATION
        });
      }
      return duplicated;
    });
    if (duplicatedFields.length > 0) {
      _toast.error(ErrorMessages.TEAM_PASSWORD);
      return;
    }

    // 위의 모든 validation을 극복했다면 이제 서버에 저장하자
    dispatch(updateTeamPasswords(_teamPasswords)).then(unwrapResult)
    .then((data) => {
      _toast.success("성공적으로 비밀번호를 변경하였습니다");
      reset();
    });
  };

  const resetPasswords = () => {
    let teamPasswords: VC.TeamPassword[] = defaultTeams.map((team) => {
      return {team, password: '0'}
    });
    dispatch(updateTeamPasswords(teamPasswords)).then(unwrapResult)
    .then((data) => {
      _toast.success("성공적으로 비밀번호를 초기화했습니다");
      reset();
    });
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>팀 비밀번호</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">팀 비밀번호를 변경해주세요</Card.Subtitle>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {
            [...(Array(Math.floor((teamPasswords.length+1)/2)).keys())].map((index) => {
              const [left, right]: number[] = [index*2, index*2 + 1];
              const [lTP, rTP]: VC.TeamPassword[] = [teamPasswords[left], teamPasswords[right]];
              const leftHasError = !!((errors && errors[left]) 
                && (
                  (errors[left]!.password?.type == 'pattern') ||
                  (errors[left]!.password?.type == 'duplication')
                ) 
              );
              const rightHasError = !!((errors && errors[right]) 
                && (
                  (errors[right]!.password?.type == 'pattern') ||
                  (errors[right]!.password?.type == 'duplication')
                ) 
              );
              return (<Form.Group as={Row} className="mb-3" key={index+1}>
                <Col>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{left+1}팀</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="hidden" {...register(`${left}.team` as const)} value={left+1} />
                    <FormControl {...register(`${left}.password` as const)} placeholder={lTP.password} isInvalid={leftHasError}/>
                    <Form.Control.Feedback type="invalid">{leftHasError && errors[left]!.password!.message!}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{right+1}팀</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="hidden" {...register(`${right}.team` as const)} value={right+1} />
                    <FormControl {...register(`${right}.password` as const)} placeholder={rTP.password} isInvalid={rightHasError}/>
                    <Form.Control.Feedback type="invalid">{rightHasError && errors[right]!.password!.message!}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Form.Group>);
            })
          }
          <div className="d-flex justify-content-between">
            <Button type="submit" className="me-3">저장</Button>
            <Button variant="danger" type="button" onClick={resetPasswords}>초기화</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
};

export default TeamPasswords;