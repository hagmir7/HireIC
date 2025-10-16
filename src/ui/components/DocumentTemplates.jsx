import React, { useState } from 'react';
import { Avatar, Button, Card, Flex, Modal, Space } from 'antd';
import { Copy, PlusCircle } from 'lucide-react';
import { handlePrint } from '../utils/config';


const DocumentTemplates = () => {
    const [opne, setOpne] = useState(false);
    return (
        <Flex vertical gap="middle" align="flex-start">
            <Space className='cursor-pointer' direction='vertical' onClick={() => setOpne(true)}>
                <Avatar icon={<PlusCircle />} size={40} />
            </Space>
            <Modal
                title="Modèles de documents"
                centered
                open={opne}
                onOk={() => setOpne(false)}
                onCancel={() => setOpne(false)}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                {/* <div className='mt-4'></div> */}
                <Card
                    size="small" className='cursor-pointer hover:shadow-sm mt-5'
                    onClick={()=> handlePrint("http://localhost:8000/pdf")}
                    >
                        <div className='flex gap-3 items-center'>
                            <Copy size={20}/>
                             <span className='text-md font-bold'>Fiche Entretien d'Embauche</span>
                        </div>
                   
                </Card>
            </Modal>
        </Flex>
    );
};
export default DocumentTemplates;