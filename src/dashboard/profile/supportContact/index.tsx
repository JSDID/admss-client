import { DashboardDialog } from "dashboard/common/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { DialogProps } from "primereact/dialog";
import "./index.css";
import { createOrUpdateSupportMessage } from "http/services/support.service";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { ComboBox } from "dashboard/common/form/dropdown";

const SUPPORT_CONTACT_TOPICS: ReadonlyArray<string> = [
    "Question",
    "Problem",
    "Feature request",
    "General",
];

export const SupportContactDialog = ({ visible, onHide }: DialogProps): JSX.Element => {
    const toast = useToast();
    const [email, setEmail] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    useEffect(() => {
        const isEveryFieldFilled = email.trim() && topic.trim() && description.trim();
        setIsButtonDisabled(!isEveryFieldFilled);
    }, [email, topic, description]);

    const handleSendSupportContact = async (): Promise<void> => {
        const response = await createOrUpdateSupportMessage({
            email: email,
            topic: topic,
            message: description,
        });

        if (!response || response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response?.error || "Error while sending message",
                life: TOAST_LIFETIME,
            });
        } else {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Message sent successfully",
                life: TOAST_LIFETIME,
            });
        }

        onHide();
        return;
    };

    return (
        <DashboardDialog
            draggable={false}
            position='top'
            className='dialog__contact-support contact-support'
            footer='Send'
            header='Contact support'
            visible={visible}
            onHide={onHide}
            action={handleSendSupportContact}
            buttonDisabled={isButtonDisabled}
        >
            <InputText
                placeholder='E-mail'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <ComboBox
                placeholder='Choose your topic'
                value={topic}
                options={[...SUPPORT_CONTACT_TOPICS]}
                className='flex align-items-center'
                onChange={(event) => setTopic(event.target.value)}
            />
            <InputTextarea
                placeholder='Describe your problem...'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className='contact-support__description'
            />
        </DashboardDialog>
    );
};
