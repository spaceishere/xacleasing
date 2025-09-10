import React from "react";
import { Button, Result } from "antd";
import { __ } from "../utils";

const NotFound = () => {
  return (
    <section className="w-100 h-100">
      <div className="content-wrapper notFound">
        <Result
          status="404"
          title="404"
          subTitle={__("Тохирох хуудас олдохгүй байна")}
          extra={
            <Button type="primary">
              <a href="/">{__("Нүүр хуудасруу буцах")}</a>
            </Button>
          }
        />
      </div>
    </section>
  );
};

export default NotFound;
