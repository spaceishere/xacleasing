import React, { useState } from "react";
import { Button, Row, Modal, Form, Input, notification } from "antd";
import { MailOutlined, SendOutlined } from "@ant-design/icons";
import emailjs from "emailjs-com";
import { cleanContent } from "../utils";
import useTranslation from "next-translate/useTranslation";

const SendEmail = (props) => {
  const { t } = useTranslation("common");

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");

  const subject = cleanContent(props.subject);
  const content = cleanContent(props.content);

  const { acf } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    setVisible(false);

    const templateParams = {
      email,
      subject,
      content,
      aan_subtitle: acf.labels.legal_entities,
      ind_subtitle: acf.labels.individuals,
      req_subtitle: acf.labels.requirements,
      individuals: acf.individuals,
      aan: acf.legal_entities,
      req: acf.requirements,
    };

    emailjs
      .send("gmail", "xacleasing", templateParams, "user_FpxzyiXNUL7JAEqalfg2g")
      .then(
        function (response) {
          notification.success({
            message: t("Амжилттай илгээлээ"),
          });
        },
        function (error) {
          notification.error({
            message: t("Амжилтгүй боллоо"),
          });
        }
      );
  };

  return (
    <Row justify="center" className="mt-2">
      <Button onClick={() => setVisible(true)}>
        <MailOutlined /> {t("Цахим шуудан")}
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        className="email-modal"
        footer={null}
      >
        <h3>
          {t(
            "Та бүрдүүлэх материалын жагсаалтыг цахим шуудангаар авахыг хүсвэл хаягаа оруулна уу."
          )}
        </h3>

        <Form onSubmit={handleSubmit}>
          <Form.Item
            name="email"
            rules={[{ type: "email", message: t("Имэйл буруу байна") }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Цахим шууданг оруулна уу")}
              className="text-primary"
            />
          </Form.Item>
          <Form.Item>
            <Button type="submit" onClick={handleSubmit}>
              {t("Илгээх")} <SendOutlined />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default SendEmail;
