import { Col, Row } from "antd";
import { FacebookOutlined, InstagramOutlined, LinkedinOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';

const Socials = () => {

    return (
        <Col xs={8} sm={8} md={7} lg={4} xl={4} className="social-wrapper" >
            <ul className="d-flex list-style-none socials h-100">
                <li><a target="_blank" href="https://www.facebook.com/xacleasing"><FacebookOutlined /></a></li>
                <li><a target="_blank" href="https://mobile.twitter.com/XacLeasing"><TwitterOutlined /></a></li>
                <li><a target="_blank" href="https://www.youtube.com/channel/UCMch9dV7fFWCB0S5pHLxhAQ"><YoutubeOutlined /></a></li>
                <li><a target="_blank" href="https://www.linkedin.com/company/xacleasing-llc"><LinkedinOutlined /></a></li>
                <li><a target="_blank" href="https://www.instagram.com/xacleasing/?igshid=18npgzeqslif"><InstagramOutlined /></a></li>
            </ul>
        </Col>
    );
};

export default Socials;
