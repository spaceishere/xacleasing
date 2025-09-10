import React, { useState } from "react";
import { Col, Modal, Statistic, Row } from "antd";
import { calcMonthlyPayment, calcI } from "../../utils";
import InputWithSlider from "./InputWithSlider";
import TableData from "./TableData";
import useTranslation from "next-translate/useTranslation";

const Calculator = ({ isIndex }) => {
  const { t } = useTranslation("common");

  const [state, setState] = useState({
    amount: 100000000,
    downPayment: 0,
    interestRate: 1.5,
    period: 24,
    loading: false,
    showModal: false,
  });

  const handleChange = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const hideModal = () => {
    setState((prev) => ({ ...prev, showModal: false }));
  };

  const calcMonthlyPaymentValue = () => {
    const { amount, downPayment, interestRate, period } = state;
    return (amount - downPayment) / calcI(interestRate, period);
  };

  const calcInterestPayment = (balance) =>
    balance * (state.interestRate / 1200);

  const calcLoanPayment = (balance) =>
    calcMonthlyPaymentValue() - calcInterestPayment(balance);

  const calcBalance = (balance) => Math.abs(balance - calcLoanPayment(balance));

  const getLoanData = () => {
    const { interestRate, period, amount, downPayment } = state;
    const leaseAmount = amount - downPayment;
    let balance = leaseAmount;
    const data = [];

    for (let i = 0; i <= period; i++) {
      if (i === 0) {
        data.push({
          key: i,
          principalPayment: 0,
          interestPayment: 0,
          totalPayment: 0,
          unpaidBalance: Number(balance.toFixed()).toLocaleString(),
        });
      } else {
        const principal = calcLoanPayment(balance);
        const interest = calcInterestPayment(balance);
        const total = calcMonthlyPayment(interestRate, period, leaseAmount);

        data.push({
          key: i,
          principalPayment: Number(principal.toFixed()).toLocaleString(),
          interestPayment: Number(interest.toFixed()).toLocaleString(),
          totalPayment: Number(total.toFixed()).toLocaleString(),
          unpaidBalance: Number(
            calcBalance(balance).toFixed()
          ).toLocaleString(),
        });

        balance = calcBalance(balance);
      }
    }

    return data;
  };

  const renderTable = () => (
    <Col span={24} className="mt-2 pt-2">
      <h2 className="title purple my-1 pb-1">{t("ЭРГЭН ТӨЛӨЛТИЙН ХУВААРЬ")}</h2>
      <TableData loading={state.loading} tableData={getLoanData()} />
    </Col>
  );

  const { amount, downPayment, interestRate, period, loading, showModal } =
    state;
  const leaseAmount = amount - downPayment;

  return (
    <Row justify="center" className="w-100 h-100" align="middle">
      <Col xs={24} sm={14} md={12} lg={12} className="br">
        <h2 className={`title purple py-2 ${!isIndex && "upper-case"}`}>
          {t("ТООЦООЛУУР")}
        </h2>

        <div className="calculation pr-2">
          <InputWithSlider
            name="amount"
            label={t("Хөрөнгийн үнэ")}
            min={0}
            step={100000}
            max={5500000000}
            handleChange={handleChange}
            value={amount}
            precision={0}
            formatter="₮"
          />

          <InputWithSlider
            name="downPayment"
            label={t("Урьдчилгаа төлбөр")}
            min={0}
            step={100000}
            max={amount}
            handleChange={handleChange}
            value={downPayment}
            precision={0}
            formatter="₮"
          />

          <InputWithSlider
            name="interestRate"
            label={t("Түрээсийн хүү (жилээр)")}
            min={0}
            step={0.1}
            max={20}
            handleChange={handleChange}
            value={interestRate}
            precision={0}
            formatter="%"
          />

          <InputWithSlider
            name="period"
            label={t("Түрээсийн хугацаа (сараар)")}
            min={6}
            step={1}
            max={96}
            handleChange={handleChange}
            value={period}
            precision={0}
            formatter="сар"
          />
        </div>
      </Col>

      <Col xs={24} sm={10} md={12} lg={12}>
        <div className="result-wrapper py-2">
          <div className="monthlyPayment">
            <Statistic
              className="lease-amount"
              title={t("Түрээсийн дүн")}
              value={leaseAmount}
              suffix=" ₮"
            />
            <Statistic
              title={t("Сард төлөх дүн")}
              value={calcMonthlyPayment(interestRate, period, leaseAmount)}
              precision={0}
              suffix=" ₮"
              className="month-amount"
            />

            {isIndex && (
              <a
                onClick={() => handleChange("showModal", true)}
                className="more-btn"
                href="#"
              >
                {t("Хүснэгтээр харах")}
              </a>
            )}
          </div>
        </div>
      </Col>

      {isIndex ? (
        <Modal
          title={t("Tооцоолуур")}
          visible={showModal}
          onCancel={hideModal}
          footer={null}
          width={992}
        >
          <TableData loading={loading} tableData={getLoanData()} />
        </Modal>
      ) : (
        renderTable()
      )}
    </Row>
  );
};

export default Calculator;
