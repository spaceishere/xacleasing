import React from "react";
import { Col, Image, Row } from "antd";
import { getData, regex } from "../../utils";
import GoogleMap from "../map/GoogleMap";
import Feedback from "./feedback";
import { FieldTimeOutlined, PushpinOutlined, PhoneOutlined } from "@ant-design/icons";
import useTranslation from "next-translate/useTranslation";

const Contact = ({ branchList, graphqlBranches = null, graphqlLoading = false, graphqlError = null }) => {
  const { t } = useTranslation("common");

  console.log("GraphQL branches:", graphqlBranches);

  const renderBranch = (branch) => {
    console.log("Branch:", branch);
    const branchTitle = branch.title?.rendered || branch.title || "";

    const customData = branch.customFieldsData || {};
    const acfData = branch.acf || {};

    const customFields = Array.isArray(branch.customFieldsData) ? branch.customFieldsData : [];
    const address = customFields[0]?.value || branch.content?.rendered || branch.content || "";
    const time = customFields[1]?.value || "";
    const phone = customFields[2]?.value || "";

    return (
      <Col xs={24} sm={24} md={24} lg={24} xl={12} key={branch._id || branch.id || branchTitle}>
        <div className="branch-item">
          <ul className="branch-detail">
            <h3>{regex(branchTitle)}</h3>
            <li>
              <PushpinOutlined />
              <div dangerouslySetInnerHTML={{ __html: address }} />
            </li>
            {time && (
              <li>
                <FieldTimeOutlined />
                <div dangerouslySetInnerHTML={{ __html: time }} />
              </li>
            )}
            {phone && (
              <li>
                <PhoneOutlined />
                <div dangerouslySetInnerHTML={{ __html: phone.replace(/\s+/g, "<br/>") }} />
              </li>
            )}
          </ul>
        </div>
      </Col>
    );
  };

  const renderContent = () => {
    if (branchList) {
      const branchesToRender = graphqlBranches || [];

      if (!branchesToRender.length && !graphqlLoading) {
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Салбар байршил олдсонгүй</p>
          </div>
        );
      }

      return (
        <Row gutter={32} className="mt-2 pt-2">
          {branchesToRender.map(renderBranch)}
          {graphqlLoading && (
            <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
              <p>Салбарын мэдээлэл ачааллаж байна...</p>
            </Col>
          )}
          {graphqlError && (
            <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
              <p>GraphQL алдаа: {graphqlError}</p>
            </Col>
          )}
        </Row>
      );
    }

    return (
      <Row justify="center" gutter={32} className="mt-2">
        <Col xs={24} sm={24} md={24} lg={12}>
          <ul className="list-style-none contact-info">
            <li>
              <span>{t("УТАС") + ":"}</span>
              <a href="tel:7011-2061">
                <p>7011-2061</p>
              </a>
            </li>
            <li>
              <span>{t("ХАЯГ") + ":"}</span>
              <p>{t("ХасЛизинг цамхаг, 5-р давхар, 1-р хороо, Бага тойруу, Чингэлтэй дүүрэг, Улаанбаатар-15170, Монгол улс")}</p>
            </li>
            <li>
              <span>{t("ЦАХИМ ШУУДАН") + ":"}</span>
              <p>
                <a href="mailto:info@xacleasing.mn">info@xacleasing.mn</a>
              </p>
            </li>
          </ul>
        </Col>
        <Col xs={24} md={22} sm={24} lg={12}>
          <Feedback />
        </Col>
      </Row>
    );
  };

  // GoogleMap-д дамжуулах өгөгдөл
  const mapItems = graphqlBranches || [];

  return (
    <>
      {/* Google Map зөвхөн салбарын жагсаалт байх үед л харуулна */}
      {branchList && (
        <div className="w-100 map index-map">
          <GoogleMap items={mapItems} />
        </div>
      )}
      {renderContent()}
    </>
  );
};

export default Contact;
