import React from "react";
import styled from "styled-components";
import './MatchedMessage.css'

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

interface MatchedMessageProps {
  chatId: string;
  content: string;
  sender: string;
  date: string;
  onClick: (chatId: string, otherUserId: string) => void;
}

const MatchedMessage: React.FC<MatchedMessageProps> = ({ chatId, content, sender, date, onClick }) => {

  const handleClick = () => {
    onClick(chatId, sender);
  };

  return (
    <div className="matched-message-container" onClick={handleClick}>
      <img className="avatar" src={"https://picsum.photos/40"} />
      <Content>
        <div style={{fontWeight: "700"}}>{sender}</div>
        <div style={{fontWeight: "300"}}>{content}</div>
        <div style={{fontWeight: "300", fontSize: "12px"}}>{date}</div>
      </Content>
    </div>
  );
};

export default MatchedMessage;
