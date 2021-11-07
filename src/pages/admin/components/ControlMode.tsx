import React, { Fragment, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { Card, Form , Col, Row} from "react-bootstrap";
import { fetchControlMode, updateControlMode } from "../../../redux/features/controlModeSlice";
import { $CombinedState } from "redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { _toast } from "../../../utils";
import { client } from "../../../utils/global";
import { RESET_SIMILARWORDS, RESET_SPEEDS, VACATE_SIMILARWORDS, VACATE_SPEEDS } from "../../../utils/query";
import { fetchTeamCommands } from "../../../redux/features/commandTableSlice";
import { fetchEditable, updateEditableSimilarWords, updateEditableSpeeds } from "../../../redux/features/editableSlice";

const ControlMode = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchControlMode());
  }, []);
  const { controlMode, fetchPending, updatePending, fetchError, updateError } = useAppSelector((state: RootState) => state.controlMode);
  console.log("controlMode : ", controlMode);
  return (
    <Card>
      <Card.Body>
        <Card.Title>음성/리모콘 선택</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">음성인식으로 포크봇을 조종할것인지, 리모콘으로 할것인지 선택해주세요.</Card.Subtitle>
          <Form.Group as={Row}>
            <Col sm={10}>
              <Form.Check
                checked={controlMode === 'vc' ? true : false}
                disabled={fetchPending}
                type="radio"
                label="음성인식"
                name="controlmode"
                id="controlmode-voice"
                onChange={ async () => {
                  console.log("VC onChange is called");
                  // controlMode 를 Voice로 변경
                  dispatch(updateControlMode("vc")).then(unwrapResult)
                    .then(data => {
                      _toast.success("음성인식으로 변경했습니다");
                    });

                  // 속도값은 기본값으로 변경
                  client.mutate({ mutation: RESET_SPEEDS }).then(() => {
                    dispatch(fetchTeamCommands());
                    _toast.success("속도값을 기본값으로 변경했습니다");
                  }); 

                  // 음성인식 수정 가능으로 변경
                  dispatch(updateEditableSimilarWords(true));

                  // 유사단어를 모두 삭제
                  client.mutate({ mutation: VACATE_SIMILARWORDS }).then(() => {
                    dispatch(fetchTeamCommands());
                    _toast.success("유사단어를 모두 지웠습니다");
                  }); 
                }}
              />
              <Form.Check
                checked={controlMode === 'rc' ? true : false}
                disabled={fetchPending}
                type="radio"
                label="리모콘"
                name="controlmode"
                id="controlmode-rc"
                onChange={() => {
                  console.log("RC onChange is called");
                  // controlMode를 리모콘으로 변경
                  dispatch(updateControlMode("rc")).then(unwrapResult)
                    .then(data => {
                      _toast.success("리모콘으로 변경했습니다");
                    });

                  // 속도값을 모두 지운다
                  client.mutate({ mutation: VACATE_SPEEDS }).then(() => {
                    dispatch(fetchTeamCommands());
                    _toast.success("속도값을 모두 지웠습니다");
                  });

                  // 리모콘을 수정 가능으로 변경
                  dispatch(updateEditableSpeeds(true));

                  client.mutate({ mutation: VACATE_SIMILARWORDS }).then(() => {
                    dispatch(fetchTeamCommands());
                    _toast.success("유사단어를 모두 지웠습니다");
                  });
                }}
              />
            </Col>
          </Form.Group>
      </Card.Body>
    </Card>
  )
};

export default ControlMode;