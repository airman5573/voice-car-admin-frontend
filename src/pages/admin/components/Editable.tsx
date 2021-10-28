import { ApolloError } from "@apollo/client";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, useEffect, FC } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { fetchAdminPassword } from "../../../redux/features/adminPasswordSlice";
import { fetchControlMode } from "../../../redux/features/controlModeSlice";
import { fetchAllTeamPasswords } from "../../../redux/features/teamPasswordSlice";
import { fetchTeamCommands } from "../../../redux/features/commandTableSlice";
import { getErrorCode, _toast } from "../../../utils";
import { client } from "../../../utils/global";
import { RESET_SIMILARWORDS, VACATE_SIMILARWORDS, RESET_SPEEDS, VACATE_SPEEDS, RESET } from "../../../utils/query";
import { VC } from "../../../utils/types";
import { fetchEditable, updateEditableSimilarWords, updateEditableSpeeds } from "../../../redux/features/editableSlice";

type ButtonContainerProps = {
  variant: string,
  openModal: (title: string, message: string, callback: () => Promise<any>) => void
}

const VCEditableSimilarWordsRadio: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const { editableSimilarWords, fetchPending, updatePending, fetchError, updateError } = useAppSelector((state: RootState) => state.editable);
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(fetchEditable()); }, []);
  return (
    <Form>
      <Form.Check
        checked={editableSimilarWords}
        disabled={fetchPending || updatePending}
        className="mb-3"
        name="vc-editable-similarwords"
        type="radio"
        label="유사단어 수정 가능"
        id="vc-editable-similarwords-enable"
        onChange={() => {
          // 수정 가능으로 바꾼다
          dispatch(updateEditableSimilarWords(true));

          // 유사단어를 모두 지운다
          client.mutate({ mutation: VACATE_SIMILARWORDS }).then(() => {
            dispatch(fetchTeamCommands());
            _toast.success("유사단어를 모두 지웠습니다");
          });
        }}>
      </Form.Check>
      <Form.Check
        checked={!editableSimilarWords}
        disabled={fetchPending || updatePending}
        name="vc-editable-similarwords"
        type="radio"
        label="유사단어 수정 불가능"
        id="vc-editable-similarwords-disable"
        onChange={() => {
          dispatch(updateEditableSimilarWords(false));

          // 유사단어를 초기화한다
          client.mutate({ mutation: RESET_SIMILARWORDS }).then(() => {
            dispatch(fetchTeamCommands());
            _toast.success("유사단어를 기본값으로 변경합니다");
          }); 
        }}>
      </Form.Check>
    </Form>
  );
}

const RCEditableSpeedsRadio: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const { editableSpeeds, fetchPending, updatePending, fetchError, updateError } = useAppSelector((state: RootState) => state.editable);
  useEffect(() => { dispatch(fetchEditable()); }, []);
  return (
    <Form>
      <Form.Check
        checked={editableSpeeds}
        disabled={fetchPending || updatePending}
        className="mb-3"
        name="vc-editable-speeds"
        type="radio"
        label="속도값 수정 가능"
        id="vc-editable-speeds-enable"
        onChange={() => {
          dispatch(updateEditableSpeeds(true));

          // 속도값을 모두 지웠습니다
          client.mutate({ mutation: VACATE_SPEEDS }).then(() => {
            dispatch(fetchTeamCommands());
            _toast.success("속도값을 모두 지웠습니다");
          });
        }}>
      </Form.Check>
      <Form.Check
        checked={!editableSpeeds}
        disabled={fetchPending || updatePending}
        name="vc-editable-speeds"
        type="radio"
        label="속도값 수정 불가능"
        id="vc-editable-speeds-disable"
        onChange={() => {
          dispatch(updateEditableSpeeds(false));

          // 속도값을 기본값으로 변경합니다
          client.mutate({ mutation: RESET_SPEEDS }).then(() => {
            dispatch(fetchTeamCommands());
            _toast.success("속도값을 기본값으로 변경했습니다");
          });
        }}>
      </Form.Check>
    </Form>
  );
}

const Reset = ({}) => {
  const [show, setShow] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalMessage, setModalMessage] = useState<string>();
  const [callback, setCallback] = useState<() => Promise<void>>(); // useState는 함수를 호출한 리턴값을 callback에 담는다.
  const { controlMode, fetchPending } = useAppSelector((state: RootState) => state.controlMode);

  const openModal = (title: string, message: string, callback: () => Promise<void>) => {
    setModalTitle(title);
    setModalMessage(message);
    setShow(true);
    setCallback(() => callback); // setCallback에 함수를 넣으면, 이거를 호출해서 callback에 담는다.
  };

  const handleClose = () => setShow(false);

  const handleOK = () => {
    setPending(true);
    if (callback) {
      callback!().then(() => {
        setPending(false);
        _toast.success("초기화를 완료했습니다");
        setShow(false);
      })
      .catch((err: ApolloError) => {
        setPending(false);
        const [code, message] = [getErrorCode(err), err.message];
        _toast.error(message);
        setShow(false);
      });
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>수정모드변경</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">수정가능 여부를 설정합니다</Card.Subtitle>
        { controlMode == 'vc' &&
          <VCEditableSimilarWordsRadio variant="primary" openModal={openModal}/>
        }
        { controlMode == 'rc' &&
          <RCEditableSpeedsRadio variant="primary" openModal={openModal} />
        }
      </Card.Body>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body> <p>{modalMessage}</p> </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShow(false)}}>닫기</Button>
          <Button variant="primary" disabled={isPending} onClick={handleOK}>확인</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
};

export default Reset;