import React, { Fragment, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { Card, Form , Col, Row} from "react-bootstrap";
import { fetchControlMode, updateControlMode } from "../../../redux/features/controlModeSlice";
import { $CombinedState } from "redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { _toast } from "../../../utils";
import { client } from "../../../utils/global";
import { RESET_SPEEDS } from "../../../utils/query";
import { fetchTeamCommands } from "../../../redux/features/commandTableSlice";

const ControlMode = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchControlMode());
  }, []);
  const { controlMode, fetchPending, updatePending, fetchError, updateError } = useAppSelector((state: RootState) => state.controlMode);
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
                onChange={() => {
                  dispatch(updateControlMode("vc")).then(unwrapResult)
                    .then(data => { 
                      client.mutate({ mutation: RESET_SPEEDS }).then(() => { 
                        dispatch(fetchTeamCommands());
                        _toast.success("음성인식으로 변경했습니다"); });
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
                  dispatch(updateControlMode("rc")).then(unwrapResult)
                    .then(data => { _toast.success("리모콘으로 변경했습니다"); });
                }}
              />
            </Col>
          </Form.Group>
      </Card.Body>
    </Card>
  )
};

export default ControlMode;