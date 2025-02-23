from wine import Wine
from beer import Beer
from market import Market

"""
TODO: Доработать заготовки классов вина (Wine), пива (Beer) и магазина (Market) таким образом, чтобы через класс Market можно было:

    * получить список всех напитков (вина и пива) отсортированный по наименованию
    * проверить наличие напитка в магазине (за время О(1))
    * получить список напитков (вина и пива) в указанном диапазоне даты производства
    * (*) написать свой декоратор, который бы логировал начало выполнения метода и выводил время выполнения
"""

if __name__ == '__main__':
    wines = [Wine("Red alco 0%", "2025-01-01"), Wine("White alco 0%", "2025-02-02"), Wine("Blue alco 0%", "2025-03-03")]
    beers = [Beer("Beer black alco 0%", "2025-01-01"), Beer("Beer purple alco 0%", "2025-02-02"), Beer("Beer green alco 0%", "2025-03-03")]

    market = Market(wines=wines, beers=beers)

    print(market.has_drink_with_title("Beer black alco 0%"))
    print(market.has_drink_with_title("Beer alco")) 
    print(market.get_drinks_sorted_by_title())
    print(market.get_drinks_by_production_date("2025-02-02", "2025-03-03"))

    drink1 = Beer()
    print(drink1)
    
    drink2 = Beer(title="Dragon 0%", production_date="2025-01-11")
    print(drink2) 

    drink3 = Beer(production_date="2025-01-11")
    print(drink3) 

   

