import ArticleCard from './ArticleCard';

function renderArticleCard(className: string) {
  const components: ArticleCard[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new ArticleCard(className, element));
  });
  return components;
}

renderArticleCard('.article-card');
