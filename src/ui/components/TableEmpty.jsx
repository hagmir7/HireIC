import { Button, Empty, Typography } from "antd";
import { PlusCircle } from "lucide-react";


function TableEmpty({ colSpan, description, Create }) {
    return (
        <tr>
            <td colSpan={colSpan} className="p-8 text-center">
                <div className="flex flex-col items-center justify-center w-full">
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        style={{ image: { height: 100 } }}
                        description={<Typography.Text>{description}</Typography.Text>}
                    >
                        {
                            Create ? <Button
                                type="primary"
                                onClick={() => Create(true)}
                                className="flex items-center gap-1"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Créer
                            </Button> : ""
                        }
                    </Empty>
                </div>
            </td>
        </tr>
    );
}
export default TableEmpty;