package com.rgpay.pos

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.rgpay.pos.core.ui.screens.WelcomeScreen
import com.rgpay.pos.features.registrations.presentation.ApiKeyScreen
import com.rgpay.pos.features.registrations.presentation.DeviceRegistrationScreen
import com.rgpay.pos.features.tabs.presentation.TabsHomeScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

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
                apiKey = apiKey
            )
        }
        
        // Tela principal de comandas
        composable("tabs_home") {
            TabsHomeScreen(
                navController = navController,
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
    }
}