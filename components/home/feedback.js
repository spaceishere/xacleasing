import React, { useState } from "react";
import { Button, Input, Form, notification, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import emailjs from "emailjs-com";
import useTranslation from "next-translate/useTranslation";
import { useGraphQL } from "../../providers/ApolloProvider";

const { Option } = Select;

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: msg,
  });
};

const WIDGETS_SAVE_LEAD = `
  mutation widgetsSaveLead($formId: String!, $submissions: [FieldValueInput], $browserInfo: JSON!, $cachedCustomerId: String) {
    widgetsSaveLead(
      formId: $formId
      submissions: $submissions
      browserInfo: $browserInfo
      cachedCustomerId: $cachedCustomerId
    ) {
      status
      conversationId
      customerId
      errors {
        fieldId
        code
        text
        __typename
      }
      __typename
    }
  }
`;

const Feedback = () => {
  const { t } = useTranslation("common");
  const { mutate } = useGraphQL();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { name, email, message, mobile, topic } = values;

    if (!name || !message) {
      return openNotificationWithIcon("error", t("Мэдээллээ бүрэн оруулна уу"));
    }

    setLoading(true);

    try {
      // Prepare GraphQL mutation variables (FieldValueInput format)
      const submissions = [
        {
          _id: "dvEwO18OPB3A7yLtYjJ91",
          type: "input",
          value: String(name),
        },
        {
          _id: "dvEwO18OPB3A7yLtYjJ91",
          type: "input",
          value: String(email),
        },
        {
          _id: "dvEwO18OPB3A7yLtYjJ91",
          type: "input",
          value: String(mobile),
        },
        {
          _id: "dvEwO18OPB3A7yLtYjJ91",
          type: "select",
          value: String(topic === "complaint" ? t("Гомдол") : t("Санал хүсэлт")),
        },
        {
          _id: "dvEwO18OPB3A7yLtYjJ91",
          type: "textarea",
          value: String(message),
        },
      ];

      const browserInfo = {
        language: navigator.language,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending GraphQL mutation with:", {
        formId: "dvEwO18OPB3A7yLtYjJ91",
        submissions,
        browserInfo,
        cachedCustomerId: "5uoY53QC9Pwmrsq2W",
      });

      // Call GraphQL mutation
      const response = await mutate(WIDGETS_SAVE_LEAD, {
        formId: "dvEwO18OPB3A7yLtYjJ91",
        submissions,
        browserInfo,
        cachedCustomerId: "5uoY53QC9Pwmrsq2W",
      });

      console.log("GraphQL response:", response);

      if (response.widgetsSaveLead.status === "ok") {
        openNotificationWithIcon("success", t("Амжилттай илгээлээ"));
        form.resetFields();
      } else {
        const errors = response.widgetsSaveLead.errors;
        if (errors && errors.length > 0) {
          openNotificationWithIcon("error", `${t("Алдаа")}: ${errors[0].text}`);
        } else {
          openNotificationWithIcon("error", t("Амжилтгүй боллоо"));
        }
      }
    } catch (error) {
      console.error("GraphQL mutation error:", error);

      // Fallback to email.js if GraphQL fails
      try {
        const templateParams = {
          email,
          name,
          message,
          mobile,
          topic: topic === "complaint" ? t("Гомдол") : t("Санал хүсэлт"),
        };

        await emailjs.send("gmail", "feedback", templateParams, "user_FpxzyiXNUL7JAEqalfg2g");
        openNotificationWithIcon("success", t("Амжилттай илгээлээ (email)"));
        form.resetFields();
      } catch (emailError) {
        openNotificationWithIcon("error", t("Амжилтгүй боллоо"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} className="contact-form" onFinish={handleSubmit} initialValues={{ topic: "feedback" }} layout="vertical">
      <Form.Item label={t("Нэр")} name="name" rules={[{ required: true, message: t("Нэрээ оруулна уу") }]}>
        <Input placeholder={t("Нэр")} />
      </Form.Item>

      <Form.Item
        label={t("И-мэйл хаяг")}
        name="email"
        rules={[
          { required: true, message: t("И-мэйл хаягаа оруулна уу") },
          { type: "email", message: t("Зөв и-мэйл хаяг оруулна уу") },
        ]}
      >
        <Input placeholder={t("И-мэйл хаяг")} />
      </Form.Item>

      <Form.Item label={t("УТАС")} name="mobile" rules={[{ required: true, message: t("Утасны дугаараа оруулна уу") }]}>
        <Input placeholder={t("УТАС")} />
      </Form.Item>

      <Form.Item label={t("Сэдэв")} name="topic" rules={[{ required: true, message: t("Сэдвээ сонгоно уу") }]}>
        <Select>
          <Option value="feedback">{t("Санал хүсэлт ")}</Option>
          <Option value="complaint">{t("Гомдол")}</Option>
        </Select>
      </Form.Item>

      <Form.Item label={t("Мессеж")} name="message" rules={[{ required: true, message: t("Мессежээ бичнэ үү") }]}>
        <Input.TextArea rows={5} placeholder={t("Мессеж")} autoSize={{ minRows: 4, maxRows: 6 }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          {loading ? t("Илгээж байна...") : t("Илгээх")} {!loading && <SendOutlined />}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Feedback;
