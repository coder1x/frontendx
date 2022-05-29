import ArticleCard from './ArticleCard';

function renderCheckboxList(className: string) {
  const components: ArticleCard[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new ArticleCard(className, elem));
  });
  return components;
}

renderCheckboxList('.article-card');
