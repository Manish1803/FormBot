import styles from "./LandingPage.module.css";
import { LuExternalLink } from "react-icons/lu";

function LandingPage() {
  return (
    <section className={styles.landingPage}>
      <article className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <img
            src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_100,w_300/v1735027005/logo_kwmsgf.png"
            alt="FormBot Logo"
            className={styles.logo}
          />
          <div className={styles.btns}>
            <button className={styles.btnSignIn}>Sign in</button>
            <button className={styles.btnCreate}>Create a FormBot</button>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <section className={styles.titleSection}>
            <img
              src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_auto/v1735040816/SVG_i9omrw.png"
              alt="svg icons"
              className={styles.svgTriangle}
            />
            <img
              src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_auto/v1735040816/SVG-1_yrqjsp.png"
              alt="svg icons"
              className={styles.svgCircle}
            />
            <div className={styles.mainTitle}>
              Build advanced chatbots
              <br /> visually
            </div>
            <p className={styles.subText}>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web/mobile apps and start
              collecting results like magic.
            </p>
            <button className={`${styles.btnCreate} ${styles.btnFormBot}`}>
              Create a FormBot for free
            </button>
          </section>

          {/* Image Section */}
          <section className={styles.imageSection}>
            <div className={styles.circleGradient1}></div>
            <img
              src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_100/v1735026888/Figure_ovti1x.png"
              alt="FormBot Dashboard"
              className={styles.image}
            />
            <div className={styles.circleGradient2}></div>
          </section>
        </main>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <article className={styles.footerNavContainer}>
            <div className={styles.logoCol}>
              <img
                src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_100,w_300/v1735027005/logo_kwmsgf.png"
                alt="FormBot logo"
                className={styles.logo}
              />
              <p>Made with ❤️ by @cuvette</p>
            </div>

            <div className={styles.navCol}>
              <p className={styles.footerHeading}>Product</p>
              <ul className={styles.footerNav}>
                <li className={styles.footerLink}>
                  <span>Status</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>Documentation</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>Roadmap</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>Pricing</span> <LuExternalLink size="1.5rem" />
                </li>
              </ul>
            </div>

            <div className={styles.navCol}>
              <p className={styles.footerHeading}>Community</p>
              <ul className={styles.footerNav}>
                <li className={styles.footerLink}>
                  <span>Discord</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>GitHub repository</span>{" "}
                  <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>Twitter</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>Linkedin</span> <LuExternalLink size="1.5rem" />
                </li>
                <li className={styles.footerLink}>
                  <span>OSS Friends</span>
                </li>
              </ul>
            </div>

            <div className={styles.navCol}>
              <p className={styles.footerHeading}>Company</p>
              <ul className={styles.footerNav}>
                <li className={styles.footerLink}>
                  <span>About</span>
                </li>
                <li className={styles.footerLink}>
                  <span>Contact</span>
                </li>
                <li className={styles.footerLink}>
                  <span>Terms of Service</span>
                </li>
                <li className={styles.footerLink}>
                  <span>Privacy Policy</span>
                </li>
              </ul>
            </div>
          </article>
        </footer>
      </article>
    </section>
  );
}

export default LandingPage;
