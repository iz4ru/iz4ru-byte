// app/terms-of-service/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Terms of Service | iz4ru.byte',
  description: 'Terms of Service for iz4ru.byte - Last updated April 25, 2026',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full py-16">
        <article className="max-w-4xl mx-auto px-8 sm:px-8 prose prose-neutral dark:prose-invert">
          
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-border">
            <h1 className="font-lora text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: <time dateTime="2026-04-25">April 25, 2026</time>
            </p>
          </div>

          {/* Introduction */}
          <div className="prose-custom space-y-6">
            <p className="text-foreground/85 leading-relaxed">
              Please read these terms and conditions carefully before using Our Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of the iz4ru.byte website and services. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </div>

          {/* Interpretation and Definitions */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Interpretation and Definitions
            </h2>
            
            <h3 className="font-lora text-2xl font-semibold text-foreground mt-8 mb-3">
              Interpretation
            </h3>
            <p className="text-foreground/85 leading-relaxed">
              The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="font-lora text-2xl font-semibold text-foreground mt-8 mb-3">
              Definitions
            </h3>
            <p className="text-foreground/85 leading-relaxed mb-4">
              For the purposes of these Terms of Service:
            </p>
            <ul className="space-y-3 text-foreground/85 list-disc pl-6">
              <li><strong>Account</strong> means a unique account created for you to access our Service or parts of our Service.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to <strong>iz4ru.byte</strong>.</li>
              <li><strong>Content</strong> refers to content such as text, images, or other information that may be posted, uploaded, linked to or otherwise made available by you, regardless of the form of that content.</li>
              <li><strong>Country</strong> refers to: <strong>Indonesia</strong></li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Terms and Conditions</strong> (also referred to as &quot;Terms&quot;) mean these Terms of Service that form the entire agreement between you and the Company regarding the use of the Service.</li>
              <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
              <li><strong>Website</strong> refers to iz4ru.byte, accessible from <Link href="/" className="text-primary hover:underline">https://iz4ru-byte.vercel.app/</Link></li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Acknowledgment
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between you and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              By accessing or using the Service you agree to be bound by these Terms and Conditions. If you disagree with any part of these Terms and Conditions then you may not access the Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              You represent that you are over the age of <strong>16</strong>. The Company does not permit those under 16 to use the Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Your access to and use of the Service is also conditioned on your acceptance of and compliance with the <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of your personal information when you use the Service and tells you about your privacy rights and how the law protects you. Please read Our Privacy Policy carefully before using Our Service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              User Accounts
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party social media service.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Intellectual Property
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              The Service and its original content (excluding Content provided by you or other users), features and functionality are and will remain the exclusive property of iz4ru.byte and its licensors.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              The Service is protected by copyright, trademark, and other laws of both Indonesia and foreign countries.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
            </p>
            <p className="text-foreground/85 leading-relaxed mt-3">
              <strong>You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal, non-commercial use.</strong>
            </p>
          </section>

          {/* Your Right to Post Content */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Your Right to Post Content
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (comments). You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              By posting content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service. You retain any and all of your rights to any content you submit, post or display on or through the Service and you are responsible for protecting those rights.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              You agree that this license includes the right for us to make your content available to other users of the Service, who may also use your content subject to these Terms.
            </p>

            <h3 className="font-lora text-2xl font-semibold text-foreground mt-8 mb-3">
              Content Restrictions
            </h3>
            <p className="text-foreground/85 leading-relaxed mb-3">
              The Company is not responsible for the content of the Service&apos;s users. You expressly understand and agree that you are solely responsible for the content and for all activity that occurs under your account, whether done so by you or any third person using your account.
            </p>
            <p className="text-foreground/85 leading-relaxed mb-3">
              You may not post, upload, transmit, distribute, or otherwise publish any content that:
            </p>
            <ul className="space-y-2 text-foreground/85 list-disc pl-6">
              <li>Is unlawful, defamatory, abusive, threatening, harmful, obscene, or otherwise objectionable</li>
              <li>Infringes on or violates any copyright, trademark, service mark, patent, trade secret, or other proprietary rights</li>
              <li>Violates the privacy or publicity rights of any third party</li>
              <li>Contains viruses, corrupted data, or other harmful, disruptive, or destructive files</li>
              <li>Constitutes unsolicited advertising, promotional materials, or spam</li>
              <li>Impersonates any person or entity, or falsely states or otherwise misrepresents your affiliation with a person or entity</li>
              <li>Contains personal information of others (such as email addresses, phone numbers, or financial information) without their consent</li>
              <li>Violates any applicable laws, regulations, or third-party rights</li>
            </ul>
          </section>

          {/* Content Moderation */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Content Moderation
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              We reserve the right, but not the obligation, to monitor, edit, or remove content that we determine, in our sole discretion, to be in violation of these Terms or otherwise objectionable.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Prohibited Uses
            </h2>
            <p className="text-foreground/85 leading-relaxed mb-3">
              You may use our Service only for lawful purposes and in accordance with Terms. You agree not to use the Service:
            </p>
            <ul className="space-y-2 text-foreground/85 list-disc pl-6">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service, or expose them to liability</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail&quot;, &quot;chain letter&quot;, &quot;spam,&quot; or any other similar solicitation</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which, as determined by us, may harm or offend the Company or users of the Service or expose them to liability</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Disclaimer
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
            <p className="text-foreground/85 leading-relaxed mt-3">
              The Company does not warrant that:
            </p>
            <ul className="space-y-2 text-foreground/85 list-disc pl-6 mt-2">
              <li>The Service will function uninterrupted, secure or available at any particular time or location</li>
              <li>Any errors or defects will be corrected</li>
              <li>The Service is free of viruses or other harmful components</li>
              <li>The results of using the Service will meet your requirements</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="space-y-2 text-foreground/85 list-disc pl-6 mt-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
            <p className="text-foreground/85 leading-relaxed mt-3">
              In no event shall the Company&apos;s total liability to you for all damages, losses, and causes of action (whether in contract, tort (including negligence), or otherwise) exceed the amount you paid to the Company, if any, for accessing the Service or through any other means.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Indemnification
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              You agree to defend, indemnify and hold harmless the Company and its licensees and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees), resulting from or arising out of:
            </p>
            <ul className="space-y-2 text-foreground/85 list-disc pl-6 mt-2">
              <li>Your use and access of the Service</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
              <li>Any claim that one of your content caused damage to a third party</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Termination
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Governing Law
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              The laws of <strong>Indonesia</strong>, excluding its conflicts of law rules, shall govern these Terms and your use of the Service. Your use of the Service may also be subject to other local, state, national, or international laws.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Dispute Resolution
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              If you have any concern or dispute about the Service, you agree to first try to resolve the dispute informally by contacting the Company.
            </p>
            <p className="text-foreground/85 leading-relaxed mt-3">
              For any disputes that cannot be resolved informally, you agree to submit to binding individual arbitration and waive your right to participate in class actions or class-wide arbitration.
            </p>
          </section>

          {/* Changes to These Terms */}
          <section className="mt-12 space-y-6">
            <h2 className="font-lora text-3xl font-bold text-foreground mt-10 mb-4">
              Changes to These Terms
            </h2>
            <p className="text-foreground/85 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the website and the Service.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mt-12 mb-16 p-6 bg-secondary/30 rounded-xl border border-border">
            <h2 className="font-lora text-3xl font-bold text-foreground mb-4">
              Contact Us
            </h2>

            <p className="text-foreground/85 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, You can contact us:
            </p>

            <ul className="space-y-2 text-foreground/85">
              <li>
                <strong>By email:</strong>{' '}
                <a
                  href="mailto:satriamaulanaridwan56@gmail.com"
                  className="text-primary hover:underline break-all block"
                >
                  satriamaulanaridwan56@gmail.com
                </a>
              </li>

              <li>
                <strong>By visiting this page:</strong>{' '}
                <Link
                  href="/"
                  className="text-primary hover:underline break-all block"
                >
                  https://iz4ru-byte.vercel.app/
                </Link>
              </li>
            </ul>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  )
}