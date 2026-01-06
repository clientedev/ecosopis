export function Footer() {
  return (
    <footer className="border-t bg-card py-12 mt-20">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-2xl font-display font-bold text-primary mb-6">ECOSOPIS</h2>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Sua jornada para uma beleza consciente começa aqui. Cosméticos naturais que cuidam de você e do planeta.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Links Rápidos</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Produtos</a></li>
            <li><a href="#" className="hover:text-primary">Sobre Nós</a></li>
            <li><a href="#" className="hover:text-primary">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Contato</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>contato@ecosopis.com.br</li>
            <li>@ecosopis.br</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        &copy; 2026 Ecosopis. Todos os direitos reservados.
      </div>
    </footer>
  );
}
