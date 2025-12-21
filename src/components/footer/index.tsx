'use client';

import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#13253F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/our-story" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.company.aboutUs')}
                </a>
              </li>
              <li>
                <a href="/blog" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.company.blog')}
                </a>
              </li>
              <li>
                <a href="/press" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.company.pressRoom')}
                </a>
              </li>
              <li>
                <a href="/careers" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.company.careers')}
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.help.title')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.help.contactUs')}
                </a>
              </li>
              <li>
                <a href="/faqs" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.help.faqs')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.help.termsAndConditions')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.help.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="/sitemap" className="text-[#b8c5d6] hover:text-white transition-colors duration-300 text-sm">
                  {t('footer.help.sitemap')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact.title')}</h3>
            <p className="text-[#b8c5d6] text-base mb-5">{t('footer.contact.companyName')}</p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#4267B2] flex items-center justify-center hover:-translate-y-1 hover:opacity-80 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:-translate-y-1 hover:opacity-80 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center hover:-translate-y-1 hover:opacity-80 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#E60023] flex items-center justify-center hover:-translate-y-1 hover:opacity-80 transition-all duration-300 text-white font-bold text-lg"
                aria-label="Pinterest"
              >
                P
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#2d4a67] pt-6 text-center">
          <p className="text-[#b8c5d6] text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;