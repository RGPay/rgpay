// app/src/main/java/com/rgpay/pos/ui/screens/DeviceMetadataScreen.kt
package com.rgpay.pos.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.rgpay.pos.data.device.DeviceMetadataModel
import com.rgpay.pos.ui.theme.RgpayTheme

@Composable
fun RegistrationScreen(
    navController: NavController,
    deviceModel: DeviceMetadataModel = viewModel()
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    var showErrors by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Cadastro do Dispositivo",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            // Serial ID
            OutlinedTextField(
                value = deviceModel.serialId,
                onValueChange = { deviceModel.updateSerialId(it) },
                label = { Text("Número sérial*") },
                modifier = Modifier.fillMaxWidth(),
                isError = showErrors && deviceModel.serialIdHasError
            )

            // Device Name (opcional)
            OutlinedTextField(
                value = deviceModel.deviceName,
                onValueChange = { deviceModel.updateDeviceName(it) },
                label = { Text("Nome do dispositivo") },
                modifier = Modifier.fillMaxWidth(),
                isError = showErrors && deviceModel.deviceNameHasError
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        if (lifecycleOwner.lifecycle.currentState.isAtLeast(androidx.lifecycle.Lifecycle.State.RESUMED)) {
                            navController.popBackStack()
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Voltar")
                }

                Button(
                    onClick = {
                        // Mostrar erros se campos obrigatórios estiverem vazios
                        showErrors = deviceModel.serialIdHasError

                        if (!showErrors) {
                            // Prosseguir com o fluxo de registro
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Registrar")
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RegistrationScreenPreview() {
    RgpayTheme {
        RegistrationScreen(navController = rememberNavController())
    }
}
