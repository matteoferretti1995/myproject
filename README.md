# FoodBox - Food Subscription App

App mobile (Android/iOS) per abbonamenti pasti a domicilio, costruita con **React Native** + **Expo** + **TypeScript**.

## Funzionalita

- **Autenticazione** - Login e registrazione utente
- **Home** - Pasti in evidenza, categorie, banner abbonamento
- **Menu** - Catalogo completo con ricerca, filtri per categoria e dieta (vegetariano, vegano, senza glutine)
- **Dettaglio Piatto** - Ingredienti, allergeni, valori nutrizionali, aggiungi al carrello
- **Abbonamenti** - 3 piani (Basic, Standard, Premium) con fatturazione settimanale/mensile
- **Carrello** - Gestione quantita, riepilogo ordine, checkout
- **Profilo** - Info utente, gestione abbonamento, storico ordini, impostazioni

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- React Context (Auth + Cart state management)

## Avvio

```bash
npm install
npx expo start
```

## Struttura Progetto

```
src/
  components/common/    # Componenti riutilizzabili (MealCard)
  constants/            # Theme (colori, font, spaziature)
  context/              # AuthContext, CartContext
  navigation/           # AppNavigator (Tab + Stack)
  screens/
    Auth/               # Login, Register
    Home/               # Home, MealDetail
    Menu/               # Menu con filtri
    Subscription/       # Piani abbonamento
    Cart/               # Carrello e checkout
    Profile/            # Profilo e storico ordini
  services/             # Mock data
  types/                # TypeScript interfaces
```
