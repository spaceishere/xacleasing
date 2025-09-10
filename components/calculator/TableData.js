import React from "react";
import { Table } from "antd";
import useTranslation from "next-translate/useTranslation";

const TableData = ({ tableData, loading }) => {
  const { t } = useTranslation("common");

  const columns = [
    {
      title: t("Сар"),
      dataIndex: "key",
      key: "key",
    },
    {
      title: t("Үндсэн төлбөр"),
      dataIndex: "principalPayment",
      key: "principalPayment",
    },
    {
      title: t("Бодогдсон хүү"),
      dataIndex: "interestPayment",
      key: "interestPayment",
    },
    {
      title: t("Нийт төлбөр"),
      dataIndex: "totalPayment",
      key: "totalPayment",
    },
    {
      title: t("Түрээсийн үлдэгдэл"),
      dataIndex: "unpaidBalance",
      key: "unpaidBalance",
    },
  ];

  return (
    <Table
      dataSource={tableData}
      columns={columns}
      showHeader={true}
      loading={loading}
      pagination={{ pageSize: 13 }}
    />
  );
};

export default TableData;
