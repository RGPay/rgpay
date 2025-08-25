package com.rgpay.pos

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.rgpay.pos.ui.screens.WelcomeScreen
import com.rgpay.pos.registrations.screens.ApiKeyScreen
import com.rgpay.pos.registrations.screens.DeviceRegistrationScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "welcome_screen"
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
    }
}