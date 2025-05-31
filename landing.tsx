'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, BarChart4, Sparkles, Store, Menu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      {/* Навигация */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">Shopping Optimizer</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-indigo-600">Возможности</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600">Как это работает</Link>
            <Link href="#stores" className="text-gray-600 hover:text-indigo-600">Магазины</Link>
            <Button asChild>
              <Link href="/app">
                Начать использовать
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Героический блок */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Оптимизируйте свои <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">покупки</span> с помощью AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Экономьте время в магазине с умным помощником, который организует ваш список покупок по оптимальному маршруту.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/app">
                Создать список покупок
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Узнать больше
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="relative shadow-xl rounded-2xl overflow-hidden border border-gray-200">
              <img 
                src="https://placehold.co/600x900/e2e8f0/475569?text=Shopping+App+Screenshot" 
                alt="Приложение Shopping Optimizer" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Особенности */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ключевые возможности</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Наше приложение предлагает множество функций для оптимизации вашего шоппинга.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-оптимизация</h3>
              <p className="text-gray-600">
                Интеллектуальная категоризация товаров и построение оптимального маршрута с помощью технологии AI.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Поддержка магазинов</h3>
              <p className="text-gray-600">
                Адаптация под планировку различных магазинов: Lidl, Biedronka, Aldi и создание пользовательских магазинов.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart4 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Отслеживание прогресса</h3>
              <p className="text-gray-600">
                Удобное отмечание купленных товаров и визуализация прогресса покупок в режиме реального времени.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Как это работает</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Всего три простых шага для оптимизации ваших покупок.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Введите свой список покупок</h3>
              <p className="text-gray-600">
                Просто скопируйте список из мессенджера, заметок или введите вручную.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Выберите магазин</h3>
              <p className="text-gray-600">
                Укажите, в какой магазин вы идете, чтобы получить оптимальный маршрут.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Следуйте оптимальному маршруту</h3>
              <p className="text-gray-600">
                Используйте готовый оптимизированный список во время покупок.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/app">
                Попробовать сейчас
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Поддерживаемые магазины */}
      <section id="stores" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Поддерживаемые магазины</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Работаем с популярными сетями магазинов. Вы также можете добавить свой магазин.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-gray-50 h-24 rounded-xl flex items-center justify-center border border-gray-200">
              <span className="text-2xl font-bold text-gray-800">Lidl</span>
            </div>
            <div className="bg-gray-50 h-24 rounded-xl flex items-center justify-center border border-gray-200">
              <span className="text-2xl font-bold text-gray-800">Biedronka</span>
            </div>
            <div className="bg-gray-50 h-24 rounded-xl flex items-center justify-center border border-gray-200">
              <span className="text-2xl font-bold text-gray-800">Aldi</span>
            </div>
            <div className="bg-blue-50 h-24 rounded-xl flex items-center justify-center border border-blue-100">
              <span className="text-xl font-bold text-blue-600">+ Ваш магазин</span>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-bold text-xl">Shopping Optimizer</span>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 md:mb-0">
              <Link href="#features" className="text-gray-300 hover:text-white">Возможности</Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white">Как это работает</Link>
              <Link href="#stores" className="text-gray-300 hover:text-white">Магазины</Link>
              <Link href="/app" className="text-gray-300 hover:text-white">Приложение</Link>
            </div>
            
            <div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                <Link href="/app">
                  Начать
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Shopping Optimizer. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-white">Условия использования</Link>
              <Link href="#" className="text-gray-500 hover:text-white">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
