import styled from "styled-components";

const Section = styled.footer`
  background-color: #f297a6;
  height: 70vh;
  padding: 50px 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 32px;
  margin-bottom: 100px;
  margin-top: 20px;
`;

const TestimonialContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Testimonial = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  text-align: center;
  margin: 20px;
  height: 300px;

  @media only screen and (max-width: 768px) {
    width: 90%;
  }
`;

const TestimonialImage = styled.img`
  width: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const TestimonialName = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 50px;
  color: #FC3078;
`;

const TestimonialText = styled.p`
  font-size: 14px;
  color: grey;
`;

const Testimonals = () => {
  return (
    <Section>
      <Container>
        <Title>Testimonials</Title>
        <TestimonialContainer>
          <Testimonial>
            <TestimonialImage src="images/logo.png" alt="" />
            <TestimonialName>John Doe</TestimonialName>
            <TestimonialText>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu
              nulla faucibus, efficitur velit non, aliquet velit."
            </TestimonialText>
          </Testimonial>
          <Testimonial>
            <TestimonialImage src="images/logo.png" alt="" />
            <TestimonialName>Jane Smith</TestimonialName>
            <TestimonialText>
              "Donec tincidunt, eros ut dapibus ullamcorper, sapien libero
              tempor arcu, ut feugiat magna urna non turpis."
            </TestimonialText>
          </Testimonial>
          <Testimonial>
            <TestimonialImage src="images/logo.png" alt="" />
            <TestimonialName>Mike Johnson</TestimonialName>
            <TestimonialText>
              "Praesent sed tincidunt mauris, eget luctus purus. Sed vitae
              blandit odio. Quisque euismod, arcu vitae posuere finibus, arcu
              sapien fermentum nulla, eget accumsan eros velit eu urna."
            </TestimonialText>
          </Testimonial>
        </TestimonialContainer>
      </Container>
    </Section>
  );
};

export default Testimonals;
