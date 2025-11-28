import { cacheLife } from "next/cache";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Exquisite Photography',
  description: 'Our privacy policy explaining how we collect, use, and protect your personal information.',
}

const PrivacyPolicy = async () => {
  "use cache";
  cacheLife("hours");
  return (
    <div className="container mx-auto px-4 py-36 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: November 5, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to Exquisite Photography ("we," "our," or "us"). We are a South African-based photography 
            business committed to protecting your privacy and ensuring the security of your personal information 
            in accordance with the Protection of Personal Information Act, 2013 (POPIA). This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you visit our website, 
            use our services, or engage with us for photography sessions.
          </p>
          <p className="mb-4">
            By using our website or services, you agree to the collection and use of information in accordance 
            with this policy and POPIA. If you do not agree with our policies and practices, please do not use 
            our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
          <p className="mb-4">We may collect the following types of personal information:</p>
          <ul className="space-y-2 mb-4">
            <li><strong>Contact Information:</strong> Name, email address, phone number, physical address</li>
            <li><strong>Account Information:</strong> Username, password, and account preferences</li>
            <li><strong>Payment Information:</strong> Banking details, card information (processed securely through PCI-DSS compliant payment processors)</li>
            <li><strong>Identification:</strong> ID number (when required for invoicing and tax compliance)</li>
            <li><strong>Booking Information:</strong> Session dates, locations, preferences, and special requests</li>
            <li><strong>School Information:</strong> School names, grade levels, learner information for school photography services</li>
            <li><strong>Communication Data:</strong> Messages, emails, and other communications with us</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Photographic Content</h3>
          <ul className="space-y-2 mb-4">
            <li>Photographs and videos taken during photography sessions</li>
            <li>Images uploaded by you for printing or editing services</li>
            <li>Metadata associated with images (date, location, camera settings)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Technical Information</h3>
          <ul className="space-y-2 mb-4">
            <li>IP address, browser type, and device information</li>
            <li>Website usage data, pages visited, and time spent on pages</li>
            <li>Cookies and similar tracking technologies (see our Cookie Policy below)</li>
            <li>Referring website addresses and online identifiers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the collected information for the following purposes:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Service Delivery</h3>
          <ul className="space-y-2 mb-4">
            <li>To provide and manage photography services and sessions</li>
            <li>To process orders for prints, digital downloads, and other products</li>
            <li>To schedule and confirm appointments</li>
            <li>To deliver purchased products and services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Communication</h3>
          <ul className="space-y-2 mb-4">
            <li>To respond to your inquiries and provide customer support</li>
            <li>To send booking confirmations, reminders, and updates</li>
            <li>To notify you about your account, orders, or service changes</li>
            <li>To send marketing communications (with your consent)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
          <ul className="space-y-2 mb-4">
            <li>To process payments and prevent fraudulent transactions</li>
            <li>To improve our website, services, and customer experience</li>
            <li>To analyze usage patterns and conduct market research</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Marketing and Portfolio</h3>
          <ul className="space-y-2 mb-4">
            <li>To showcase our work in portfolios, galleries, and marketing materials (with explicit consent)</li>
            <li>To share on social media and promotional channels (with permission)</li>
            <li>To send newsletters and special offers (with opt-in consent)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Image Rights and Usage</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Your Images</h3>
          <p className="mb-4">
            We retain copyright to all photographs we create, but you have purchased certain usage rights 
            as specified in your service agreement. We will:
          </p>
          <ul className="space-y-2 mb-4">
            <li>Never sell your images to third parties without your explicit consent</li>
            <li>Only use your images for portfolio or marketing purposes with your written permission</li>
            <li>Always obtain a separate model release for any commercial use of images featuring identifiable people</li>
            <li>Respect your requests to not have images shared publicly</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Children's Images</h3>
          <p className="mb-4">
            For school photography and sessions involving minors (persons under 18 years of age):
          </p>
          <ul className="space-y-2 mb-4">
            <li>We require parental or guardian consent before photographing children</li>
            <li>Images of children will not be used for marketing without explicit parental permission</li>
            <li>We comply with POPIA requirements for processing children's personal information</li>
            <li>Schools and parents can request removal of images from our systems</li>
            <li>Special consent is obtained when photographing children under 12 years of age</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Share Your Information</h2>
          <p className="mb-4">We may share your information in the following circumstances:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
          <ul className="space-y-2 mb-4">
            <li>Payment processors for secure transaction processing (South African and international)</li>
            <li>Printing and fulfillment companies (local and international suppliers)</li>
            <li>Cloud storage providers for secure data storage</li>
            <li>Email service providers for communications</li>
            <li>Website hosting and analytics services</li>
          </ul>
          <p className="mb-4">
            All third-party service providers are carefully selected and required to maintain appropriate 
            security measures and comply with POPIA requirements when processing South African residents' data.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
          <ul className="space-y-2 mb-4">
            <li>When required by law or legal process</li>
            <li>To protect our rights, property, or safety</li>
            <li>To enforce our terms and conditions</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">With Your Consent</h3>
          <ul className="space-y-2 mb-4">
            <li>When you explicitly authorize us to share your information</li>
            <li>For marketing or promotional purposes you've approved</li>
          </ul>

          <p className="mb-4">
            <strong>We do not sell your personal information to third parties.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul className="space-y-2 mb-4">
            <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
            <li>Secure storage systems with access controls</li>
            <li>Regular security assessments and updates</li>
            <li>Employee training on data protection</li>
            <li>Backup systems to prevent data loss</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>
          <p className="mb-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure. 
            While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p className="mb-4">We retain your information for as long as necessary to:</p>
          <ul className="space-y-2 mb-4">
            <li>Provide you with services and fulfill our contractual obligations</li>
            <li>Comply with legal, tax, and accounting requirements</li>
            <li>Maintain business records and resolve disputes</li>
            <li>Enforce our agreements and protect our legal rights</li>
          </ul>
          <p className="mb-4">
            <strong>Photographic images:</strong> We typically retain original images for 1-2 years after a 
            session, unless otherwise specified in your service agreement. After this period, images may be 
            archived or deleted. Portfolio images (with permission) may be retained indefinitely.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights Under POPIA</h2>
          <p className="mb-4">
            Under the Protection of Personal Information Act (POPIA), you have the following rights regarding 
            your personal information:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
          <ul className="space-y-2 mb-4">
            <li>Request confirmation of whether we hold your personal information</li>
            <li>Request access to your personal information we hold</li>
            <li>Receive a description of the information and how it is used</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Correction</h3>
          <ul className="space-y-2 mb-4">
            <li>Request correction of inaccurate, irrelevant, excessive, or outdated personal information</li>
            <li>Update your personal details through your account or by contacting us</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Deletion (Right to be Forgotten)</h3>
          <ul className="space-y-2 mb-4">
            <li>Request deletion of your personal information (subject to legal obligations)</li>
            <li>Request removal of your images from public portfolios and galleries</li>
            <li>Note: We may need to retain certain information for legal, tax, or regulatory purposes</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
          <ul className="space-y-2 mb-4">
            <li>Object to the processing of your personal information on reasonable grounds</li>
            <li>Object to direct marketing communications at any time</li>
            <li>Opt-out of marketing emails by clicking "unsubscribe" in any marketing message</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restrict Processing</h3>
          <ul className="space-y-2 mb-4">
            <li>Request restriction of processing in certain circumstances</li>
            <li>Challenge the accuracy of your information while we verify it</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
          <ul className="space-y-2 mb-4">
            <li>Receive your personal information in a structured, commonly used format</li>
            <li>Transfer your information to another service provider where technically feasible</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Right to Complain</h3>
          <ul className="space-y-2 mb-4">
            <li>Lodge a complaint with the Information Regulator if you believe your rights have been violated</li>
            <li>Information Regulator Contact: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inforegulator.org.za</a></li>
            <li>Email: <a href="mailto:inforeg@justice.gov.za" className="text-primary hover:underline">inforeg@justice.gov.za</a></li>
          </ul>

          <p className="mb-4">
            To exercise these rights, please contact our Information Officer using the details provided below. 
            We will respond to your request within 30 days as required by POPIA. We may request proof of 
            identity to verify your request.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience on our website:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Essential Cookies</h3>
          <ul className="space-y-2 mb-4">
            <li>Required for website functionality and security</li>
            <li>Enable shopping cart and checkout processes</li>
            <li>Maintain your session and preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Analytics Cookies</h3>
          <ul className="space-y-2 mb-4">
            <li>Help us understand how visitors use our website</li>
            <li>Collect anonymous usage statistics</li>
            <li>Improve website performance and user experience</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Marketing Cookies</h3>
          <ul className="space-y-2 mb-4">
            <li>Track your interests to show relevant advertisements</li>
            <li>Measure effectiveness of marketing campaigns</li>
            <li>Provide personalized content</li>
          </ul>

          <p className="mb-4">
            You can control cookies through your browser settings. However, disabling certain cookies may 
            affect website functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
          <p className="mb-4">
            Our website may contain links to third-party websites, including social media platforms and 
            payment processors. We are not responsible for the privacy practices of these external sites. 
            We encourage you to read their privacy policies before providing any personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p className="mb-4">
            While we provide school photography services involving children, our website and online services 
            are not intended for children under 18 years of age to use independently. In accordance with POPIA, 
            we take special care when processing personal information of children (persons under 18 years):
          </p>
          <ul className="space-y-2 mb-4">
            <li>We work with schools and parents/guardians to obtain appropriate consents before photographing children</li>
            <li>For children under 12, we obtain prior consent from a competent person (parent/guardian) before processing their information</li>
            <li>Parents/guardians have the right to review, access, correct, delete, or refuse further collection of their child's information</li>
            <li>We comply with POPIA's special requirements for processing children's personal information</li>
            <li>Schools act as responsible parties when collecting learner information on our behalf</li>
          </ul>
          <p className="mb-4">
            If you believe we have inadvertently collected information from a child without proper consent, 
            please contact our Information Officer immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cross-Border Data Transfers</h2>
          <p className="mb-4">
            As a South African business, we primarily store and process your information within South Africa. 
            However, some of our service providers (such as cloud storage, email services, and payment processors) 
            may be located outside South Africa. When transferring personal information across borders, we ensure:
          </p>
          <ul className="space-y-2 mb-4">
            <li>The recipient country has adequate data protection laws, or</li>
            <li>The recipient is subject to legally binding agreements providing adequate protection, or</li>
            <li>We have obtained your consent for the transfer</li>
            <li>We comply with Chapter 9 of POPIA regarding trans-border information flows</li>
          </ul>
          <p className="mb-4">
            By using our services, you consent to the transfer of your information to countries with adequate 
            data protection measures in place. We take reasonable steps to ensure your information remains 
            protected in accordance with this privacy policy and POPIA requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal 
            requirements. We will notify you of any material changes by:
          </p>
          <ul className="space-y-2 mb-4">
            <li>Posting the updated policy on our website with a new "Last Updated" date</li>
            <li>Sending email notification for significant changes</li>
            <li>Displaying a notice on our website</li>
          </ul>
          <p className="mb-4">
            Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us - Information Officer</h2>
          <p className="mb-4">
            In accordance with POPIA, we have appointed an Information Officer who is responsible for 
            ensuring compliance with POPIA and handling privacy-related queries and requests.
          </p>
          <p className="mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy, your personal information, 
            or wish to exercise your POPIA rights, please contact our Information Officer:
          </p>
          <ul className="space-y-2 mb-4">
            <li><strong>Information Officer:</strong> [Name of Information Officer]</li>
            <li><strong>Email:</strong> <a href="mailto:privacy@exquisitephotography.com" className="text-primary hover:underline">privacy@exquisitephotography.com</a></li>
            <li><strong>Contact Page:</strong> <a href="/contact" className="text-primary hover:underline">Visit our contact page</a></li>
            <li><strong>Physical Address:</strong> Montmedy rd, Lorraine, Port Elizabeth</li>
            <li><strong>Phone:</strong> 084 675 6959</li>
          </ul>
          <p className="mb-4">
            We will respond to your inquiry within 30 days as required by POPIA. For access requests, 
            we may charge a prescribed fee to cover administrative costs.
          </p>
          <p className="mb-4 font-semibold">
            If you are not satisfied with our response, you have the right to lodge a complaint with the 
            Information Regulator:
          </p>
          <ul className="space-y-2 mb-4">
            <li><strong>Information Regulator (South Africa)</strong></li>
            <li>Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.inforegulator.org.za</a></li>
            <li>Email: <a href="mailto:inforeg@justice.gov.za" className="text-primary hover:underline">inforeg@justice.gov.za</a></li>
            <li>Phone: 012 406 4818</li>
            <li>Address: JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">POPIA Compliance Statement</h2>
          <p className="mb-4">
            Exquisite Photography is committed to complying with the Protection of Personal Information Act 
            4 of 2013 (POPIA) and its regulations. We process personal information in accordance with the 
            eight conditions for lawful processing:
          </p>
          <ol className="space-y-2 mb-4 list-decimal list-inside">
            <li><strong>Accountability:</strong> We take responsibility for the personal information we process</li>
            <li><strong>Processing Limitation:</strong> We process information lawfully, reasonably, and only for specific purposes</li>
            <li><strong>Purpose Specification:</strong> We collect information for specific, explicitly defined purposes</li>
            <li><strong>Further Processing Limitation:</strong> We don't process information for purposes incompatible with the original purpose</li>
            <li><strong>Information Quality:</strong> We ensure information is complete, accurate, and up to date</li>
            <li><strong>Openness:</strong> We are transparent about our information processing practices</li>
            <li><strong>Security Safeguards:</strong> We implement appropriate technical and organizational measures</li>
            <li><strong>Data Subject Participation:</strong> We respect your rights to access and correct your information</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your California Privacy Rights</h2>
          <p className="mb-4">
            While we are a South African business primarily serving South African customers, if you are a 
            California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="space-y-2 mb-4">
            <li>Right to know what personal information is collected, used, shared, or sold</li>
            <li>Right to delete personal information held by businesses</li>
            <li>Right to opt-out of sale of personal information (we do not sell personal information)</li>
            <li>Right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact our Information Officer using the details provided above.
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            This Privacy Policy forms part of our terms of service. By using our website and services, you 
            acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>POPIA Compliance:</strong> This privacy policy is compliant with the Protection of Personal 
            Information Act, 2013 (Act No. 4 of 2013) and its regulations. We are registered with the Information 
            Regulator as required by POPIA.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy