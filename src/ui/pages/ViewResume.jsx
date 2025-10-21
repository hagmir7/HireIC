import React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import { ListCheck, MessagesSquare, UserCircle } from 'lucide-react';
import ResumeInfo from '../components/ResumeInfo';
import ResumeInterviews from '../components/resume/ResumeInterviews';
import ResumeInvitations from '../components/resume/ResumeInvitations';

const ViewResume = () => {
  const { id } = useParams();

  const tabItems = [
    {
      label: (
        <div className="flex items-center gap-2 ml-4">
          <UserCircle size={15} />
          <span>Informations</span>
        </div>
      ),
      key: '1',
      children: <ResumeInfo resume_id={id} />,
    },
    {
      label: (
        <div className="flex items-center gap-2 ml-4">
          <ListCheck size={15} />
          <span>Entretiens</span>
        </div>
      ),
      key: '2',
      children: <ResumeInterviews resume_id={id} />,
    },
    {
      label: (
        <div className="flex items-center gap-2 ml-4">
          <MessagesSquare size={15} />
          <span>Invitations</span>
        </div>
      ),
      key: '3',
      children: <ResumeInvitations resume_id={id} />,
    },
  ];

  return (
    <div className="p-4 bg-white">
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ViewResume;
