import React from 'react';
import { motion } from 'motion/react';

const PrivacyPage = React.memo(() => {
  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Política de Privacidade</h1>
          
          <div className="space-y-8 text-white/60 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Introdução</h2>
              <p>
                A 6Day Studios valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site e serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Coleta de Dados</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como nome, e-mail e número de telefone, quando você entra em contato conosco ou solicita um orçamento. Também podemos coletar dados técnicos automaticamente, como endereço IP e cookies de navegação.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Uso das Informações</h2>
              <p>
                As informações coletadas são utilizadas para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Prestar e melhorar nossos serviços audiovisuais;</li>
                <li>Responder a suas dúvidas e solicitações;</li>
                <li>Enviar comunicações de marketing, caso você tenha optado por recebê-las;</li>
                <li>Cumprir obrigações legais.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Compartilhamento de Dados</h2>
              <p>
                Não vendemos nem alugamos suas informações pessoais a terceiros. Podemos compartilhar dados com parceiros de confiança que nos auxiliam na operação do site e na prestação de serviços, desde que concordem em manter a confidencialidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Segurança</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Para isso, entre em contato conosco através do e-mail fornecido em nossa página de contato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Alterações</h2>
              <p>
                Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer mudanças.
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

export default PrivacyPage;
