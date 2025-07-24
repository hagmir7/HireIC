import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import ResumeInfoForm from './ResumeInfoForm';
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle } from 'lucide-react';
import ResumeDiplome from './ResumeDiplome';
import ResumeExperience from './ResumeExperience';
import ResumeSkill from './ResumeSkill';
import ResumeLanguage from './ResumeLanguage';



const steps = [
  {
    title: 'Person',
    content: <ResumeInfoForm />,
  },
  {
    title: 'Diplômes',
    content: <ResumeDiplome />,
  },
  {
    title: 'Expérience',
    content: <ResumeExperience />,
  },
   {
    title: 'Compétences',
    content: <ResumeSkill />,
  },

   {
    title: 'Langue',
    content: <ResumeLanguage />,
  },
];


const CreateResume = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const contentStyle = {
    lineHeight: '260px',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 10,
    marginButtom: 0,
    paddingButtom: 0
  };
  return (
    <div className='p-3'>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        className="mt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-lg z-[1000]"
      >
        <div className="flex justify-between items-center">
          {/* Bouton Précédent - à gauche */}
          <div className="flex-shrink-0">
            {current > 0 && (
              <Button
                style={{
                  margin: '0 8px 0 0',
                  minWidth: 100
                }}
                onClick={() => prev()}
              >
                <ArrowLeftCircle size={20} />
                <span>Précédent</span>
              </Button>
            )}
          </div>

          {/* Indicateur de progression au centre */}
          <div className="flex-1 flex justify-center">
            <div className="text-gray-500 text-sm font-medium">
              Étape {current + 1} sur {steps.length}
            </div>
          </div>

          {/* Boutons Suivant/Terminer - à droite */}
          <div className="flex-shrink-0">
            {current < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={() => next()}
                iconPosition="end"
                style={{ minWidth: 100 }}
                className=''
              >
                <ArrowRightCircle size={20} />
                <span>Suivant</span>
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => message.success('Traitement terminé avec succès!')}
                 className=''
                style={{
                  minWidth: 100,
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a'
                }}
              >
                <CheckCircle size={20} />
                <span>Terminer</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateResume;