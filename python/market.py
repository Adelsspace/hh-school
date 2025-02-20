from  utils import execution_time

class Market:
    def __init__(self, wines: list = None, beers: list = None) -> None:
        self.wines = wines if wines is not None else []
        self.beers = beers if beers is not None else []
        self.drinks = {}

        for wine in self.wines:
            self.drinks[wine.title] = wine
        for beer in self.beers:
            self.drinks[beer.title] = beer

    @execution_time
    def has_drink_with_title(self, title=None) -> bool:
        """
        Проверяет наличие напитка в магазине за О(1)

        :param title:
        :return: True|False
        """
        return title in self.drinks
    
    @execution_time
    def get_drinks_sorted_by_title(self) -> list:
        """
        Метод получения списка напитков (вина и пива) отсортированных по title

        :return: list
        """
        return sorted(self.drinks.keys())
    
    @execution_time
    def get_drinks_by_production_date(self, from_date=None, to_date=None) -> list:
        """
        Метод получения списка напитков в указанном диапазоне дат: с from_date по to_date

        :return: list
        """
        result = []
        for drink in self.drinks.values():
            if from_date <= drink.production_date <= to_date:
                result.append(drink.title)
        return result

