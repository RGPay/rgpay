package com.rgpay.pos

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.rgpay.pos.core.ui.screens.WelcomeScreen
import com.rgpay.pos.features.registrations.presentation.ApiKeyScreen
import com.rgpay.pos.features.registrations.presentation.DeviceRegistrationScreen
import com.rgpay.pos.features.tabs.presentation.TabsHomeScreen
import com.rgpay.pos.features.tabs.presentation.TabsListScreen
import com.rgpay.pos.viewmodel.AppViewModel

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val appViewModel: AppViewModel = viewModel()

    NavHost(
        navController = navController,
        startDestination = "welcome_screen" // TODO: Mudar para "tabs_home" quando implementar autenticação
    ) {
        // Tela inicial
        composable("welcome_screen") {
            WelcomeScreen(navController = navController)
        }

        // Tela para digitar API Key
        composable("api_key_screen") {
            ApiKeyScreen(navController = navController)
        }

        // Tela de registro do dispositivo
        composable(
            route = "device_registration/{apiKey}",
            arguments = listOf(navArgument("apiKey") { type = NavType.StringType })
        ) { backStackEntry ->
            val apiKey = backStackEntry.arguments?.getString("apiKey") ?: ""
            DeviceRegistrationScreen(
                navController = navController,
                apiKey = apiKey,
                onRestaurantDataLoaded = { restaurantData ->
                    appViewModel.setRestaurantData(restaurantData)
                }
            )
        }
        
        // Tela principal de comandas
        composable("tabs_home") {
            TabsHomeScreen(
                navController = navController,
                appViewModel = appViewModel,
                onNewTabClick = {
                    navController.navigate("new_tab")
                },
                onListTabsClick = {
                    navController.navigate("list_tabs")
                },
                onMenuClick = {
                    // TODO: Implementar drawer menu
                },
                onHomeClick = {
                    navController.navigate("tabs_home") {
                        popUpTo("tabs_home") { inclusive = true }
                    }
                },
                onTabsClick = {
                    navController.navigate("list_tabs")
                }
            )
        }
        
        // Tela de listagem de comandas
        composable("list_tabs") {
            TabsListScreen(
                navController = navController,
                appViewModel = appViewModel,
                onMenuClick = {
                    // TODO: Implementar drawer menu
                },
                onHomeClick = {
                    navController.navigate("tabs_home")
                },
                onTabsClick = {
                    // Já está na tela de comandas
                },
                onManageTabClick = { tab -> // TODO: Implementar tela de detalhes da comanda
                    if (tab.tableId != null) {
                        navController.navigate("tab_details/${tab.tableId}")
                    } else {
                        navController.navigate("new_tab")
                    }
                }
            )
        }
    }
}