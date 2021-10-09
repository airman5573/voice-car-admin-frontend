import { ApolloError } from "@apollo/client";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, useEffect, FC } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { fetchAdminPassword } from "../../../redux/features/adminPasswordSlice";
import { fetchControlMode } from "../../../redux/features/controlModeSlice";
import { fetchAllTeamPasswords } from "../../../redux/features/teamPasswordSlice";
import { fetchTeamCommands } from "../../../redux/features/commandTableSlice";
import { getErrorCode, _toast } from "../../../utils";
import { client } from "../../../utils/global";
import { RESET_SIMILARWORDS, VACATE_SIMILARWORDS, RESET_SPEEDS, VACATE_SPEEDS, RESET } from "../../../utils/query";
import { VC } from "../../../utils/types";

type ButtonContainerProps = {
  variant: string,
  openModal: (title: string, message: string, callback: () => Promise<any>) => void
}

const VCResetSimilarWordsBtn: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    const callback = () => {
      return client.mutate({ mutation: RESET_SIMILARWORDS }).then(() => { dispatch(fetchTeamCommands()); });
    };
    openModal("음성인식 기본값설정", "유사단어를 미리 입력해놓은 기본값으로 설정합니다", callback);
  }
  return (
    <Button variant={variant} onClick={onClick}>음성인식 기본값설정</Button>
  );
}

const VCVacateSimilarWordsBtn: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    const callback = () => {
      return client.mutate({ mutation: VACATE_SIMILARWORDS }).then(() => { dispatch(fetchTeamCommands()); });
    };
    openModal("음성인식 공장초기화", "모든 유사단어를 삭제합니다", callback);
  }
  return (
    <Button variant={variant} onClick={onClick}>음성인식 공장초기화</Button>
  );
}

const RCResetSpeedBtn: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    const callback = () => {
      return client.mutate({ mutation: RESET_SPEEDS }).then(() => { dispatch(fetchTeamCommands()); });
    };
    openModal("리모콘 기본값설정", "속도값을 미리 입력해놓은 기본값으로 되돌립니다", callback);
  }
  return (
    <Button variant={variant} onClick={onClick}>리모콘 기본값설정</Button>
  );
}

const RCVacateSpeedBtn: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    const callback = () => {
      return client.mutate({ mutation: VACATE_SPEEDS }).then(() => { dispatch(fetchTeamCommands()); });
    };
    openModal("리모콘 공장초기화", "속도값을 모두 0으로 설정합니다", callback);
  }
  return (
    <Button variant={variant} onClick={onClick}>리모콘 공장초기화</Button>
  );
}

const TotalResetBtn: React.FC<ButtonContainerProps> = ({ variant, openModal }) => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    const callback = () => {
      return client.mutate({ mutation: RESET }).then(() => {
        dispatch(fetchAdminPassword());
        dispatch(fetchAllTeamPasswords());
        dispatch(fetchControlMode());
      });
    }
    openModal("전체 초기화", "관리자비밀번호, 팀 비밀번호, 컨트롤모드(음성/리모콘), 속도값, 유사단어를 기본값으로 설정합니다", callback);
  }
  return (
    <Button variant={variant} onClick={onClick}>전체 초기화</Button>
  )
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
        <Card.Title>초기화</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">기본값으로 돌려놓습니다</Card.Subtitle>
        { controlMode == 'vc' &&
          <>
            <div className="mb-3">
              <VCResetSimilarWordsBtn variant="primary" openModal={openModal}/>
            </div>
            <div className="mb-3">
              <VCVacateSimilarWordsBtn variant="danger" openModal={openModal}/>
            </div>
          </>
        }
        { controlMode == 'rc' &&
          <>
            <div className="mb-3">
              <RCResetSpeedBtn variant="primary" openModal={openModal}/>
            </div>
            <div className="mb-3">
              <RCVacateSpeedBtn variant="danger" openModal={openModal}/>
            </div>
          </>
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