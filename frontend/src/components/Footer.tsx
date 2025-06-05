import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>Your trusted partner for high-quality display solutions.</p>
                </div>
                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: info@highnessdisplay.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            LinkedIn
                        </Link>
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            Twitter
                        </Link>
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            Facebook
                        </Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Highness Display. All rights reserved.</p>
            </div>
        </footer>
    );
} 