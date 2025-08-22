package com.rgpay.pos.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// RGPay Dark Color Scheme - Primary theme matching frontend
private val RgpayDarkColorScheme = darkColorScheme(
    // Primary colors
    primary = RgpayPrimary,
    onPrimary = RgpayOnPrimary,
    primaryContainer = RgpayPrimaryDark,
    onPrimaryContainer = RgpayTextPrimary,
    
    // Secondary colors
    secondary = RgpaySecondary,
    onSecondary = RgpayOnSecondary,
    secondaryContainer = RgpaySecondaryDark,
    onSecondaryContainer = RgpayTextPrimary,
    
    // Surface colors
    background = RgpayBackgroundDark,
    onBackground = RgpayTextPrimary,
    surface = RgpaySurfaceDark,
    onSurface = RgpayTextPrimary,
    surfaceVariant = RgpaySurfaceVariant,
    onSurfaceVariant = RgpayTextSecondary,
    
    // Utility colors
    error = RgpayError,
    onError = RgpayOnPrimary,
    errorContainer = RgpayError,
    onErrorContainer = RgpayOnPrimary,
    
    // Outline and borders
    outline = RgpayBorder,
    outlineVariant = RgpayDivider,
    
    // Inverse colors for contrast
    inverseSurface = RgpayTextPrimary,
    inversePrimary = RgpayPrimaryDark
)

// Light color scheme for contrast (if user prefers light mode)
private val RgpayLightColorScheme = lightColorScheme(
    primary = RgpayPrimary,
    onPrimary = RgpayOnPrimary,
    primaryContainer = RgpayPrimaryLight,
    onPrimaryContainer = RgpayPrimaryDark,
    
    secondary = RgpaySecondary,
    onSecondary = RgpayOnSecondary,
    secondaryContainer = RgpaySecondaryLight,
    onSecondaryContainer = RgpaySecondaryDark,
    
    background = RgpayBackgroundLight,
    onBackground = androidx.compose.ui.graphics.Color(0xFF1C1B1F),
    surface = RgpaySurfaceLight,
    onSurface = androidx.compose.ui.graphics.Color(0xFF1C1B1F),
    
    error = RgpayError,
    onError = RgpayOnPrimary
)

@Composable
fun RgpayTheme(
    darkTheme: Boolean = true, // Default to dark theme to match frontend
    dynamicColor: Boolean = false, // Disable dynamic colors to maintain brand consistency
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> RgpayDarkColorScheme
        else -> RgpayLightColorScheme
    }
    
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // Set status bar to match background for immersive experience
            window.statusBarColor = colorScheme.background.toArgb()
            // Light status bar icons for dark theme
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
