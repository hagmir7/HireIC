import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import ResumeInfoForm from './ResumeInfoForm';
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle } from 'lucide-react';
import ResumeDiplome from './ResumeDiplome';
import ResumeExperience from './ResumeExperience';
import ResumeSkill from './ResumeSkill';
import ResumeLanguage from './ResumeLanguage';

const CreateResume = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Person',
      content: <ResumeInfoForm next={next} prev={prev} />,
    },
    {
      title: 'Diplômes',
      content: <ResumeDiplome next={next} prev={prev} />,
    },
    {
      title: 'Expérience',
      content: <ResumeExperience next={next} prev={prev} />,
    },
    {
      title: 'Compétences',
      content: <ResumeSkill next={next} prev={prev} />,
    },
    {
      title: 'Langue',
      content: <ResumeLanguage prev={prev} />,
    },
  ];

  const items = steps.map(item => ({
    key: item.title,
    title: item.title
  }));

  const contentStyle = {
    lineHeight: '260px',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 10,
    marginBottom: 0,
    paddingBottom: 0
  };

  return (
    <div className='p-3'>
      <Steps
        current={current}
        items={items}
        onChange={(value) => setCurrent(value)}
      />
      <div style={contentStyle}>{steps[current].content}</div>
    </div>
  );
};

export default CreateResume;
