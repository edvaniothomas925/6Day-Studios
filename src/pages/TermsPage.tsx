import React from 'react';
import { motion } from 'motion/react';

const TermsPage = React.memo(() => {
  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Termos de Uso</h1>
          
          <div className="space-y-8 text-white/60 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site da 6Day Studios, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo textos, imagens, vídeos, áudios, logotipos e design, é de propriedade exclusiva da 6Day Studios ou de seus licenciadores e está protegido por leis de direitos autorais e propriedade intelectual. É proibida a reprodução, distribuição ou uso não autorizado sem consentimento prévio por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Uso do Site</h2>
              <p>
                Você concorda em utilizar o site apenas para fins lícitos e de maneira que não infrinja os direitos de terceiros ou restrinja o uso do site por outros. É proibido:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Transmitir conteúdo ilegal, ofensivo ou prejudicial;</li>
                <li>Tentar acessar áreas restritas do site sem autorização;</li>
                <li>Utilizar robôs ou scripts para extrair dados do site de forma automatizada.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Serviços e Orçamentos</h2>
              <p>
                As informações sobre serviços e preços exibidas no site são informativas e podem ser alteradas sem aviso prévio. A contratação de qualquer serviço está sujeita a um contrato formal entre as partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Isenção de Responsabilidade</h2>
              <p>
                A 6Day Studios se esforça para manter as informações do site precisas e atualizadas, mas não garante a exatidão ou integridade do conteúdo. Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso ou da incapacidade de usar este site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Links para Terceiros</h2>
              <p>
                Nosso site pode conter links para sites de terceiros. Esses links são fornecidos apenas para sua conveniência e não implicam endosso ou responsabilidade pelo conteúdo desses sites externos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Lei Aplicável</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis da República de Angola. Quaisquer disputas serão resolvidas nos tribunais competentes de Luanda.
              </p>
            </section>

            <p className="pt-8 border-t border-white/10 text-sm italic">
              Última atualização: 22 de Março de 2026.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default TermsPage;
