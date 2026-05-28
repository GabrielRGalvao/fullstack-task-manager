import { useMutation, useQuery } from "convex/react";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from "../../convex/_generated/api";

export default function TodoScreen() {
  const tarefas = useQuery(api.tarefas.listar);
  const adicionarTarefa = useMutation(api.tarefas.adicionar);
  const alternarStatus = useMutation(api.tarefas.alternarStatus);
  const removerTarefa = useMutation(api.tarefas.remover);

  const [novoAssunto, setNovoAssunto] = useState('');

  const handleSalvarTarefa = async () => {
    if (!novoAssunto.trim()) return;

    await adicionarTarefa({
      assunto: novoAssunto,
      prioridade: "Alta",
    });

    setNovoAssunto('');
  };

  const handleAlternarStatus = async (id: any, statusAtual: boolean) => {
    await alternarStatus({ id, atual: statusAtual });
  };

  const handleExcluirTarefa = async (id: any) => {
    await removerTarefa({ id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas 📝</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="O que precisa ser feito?"
          placeholderTextColor="#999"
          style={styles.input}
          value={novoAssunto}
          onChangeText={setNovoAssunto}
        />
        <TouchableOpacity style={styles.button} onPress={handleSalvarTarefa}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Pendentes:</Text>
        
        {tarefas === undefined ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : (
          tarefas.map((tarefa) => (
            <View key={tarefa._id} style={styles.cardWrapper}> 
              <TouchableOpacity 
                onPress={() => handleAlternarStatus(tarefa._id, tarefa.finalizada)}
                style={[styles.card, tarefa.finalizada && styles.cardFinished]} 
              >
                <View style={[
                  styles.priorityTag, 
                  { backgroundColor: tarefa.finalizada ? '#4CD964' : '#FF3B30' } 
                ]} />
                
                <Text style={[
                  styles.cardText, 
                  tarefa.finalizada && styles.textFinished 
                ]}>
                  {tarefa.assunto}
                </Text>
              </TouchableOpacity>
          
              <TouchableOpacity 
                onPress={() => handleExcluirTarefa(tarefa._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 10, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', marginBottom: 30 },
  input: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 12, fontSize: 16, elevation: 2, color: '#333' },
  button: { backgroundColor: '#007AFF', marginLeft: 10, paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  cardWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  cardFinished: { opacity: 0.5 },
  cardText: { fontSize: 16, color: '#333' },
  textFinished: { textDecorationLine: 'line-through', color: '#8E8E93' },
  priorityTag: { width: 5, height: 20, marginRight: 15, borderRadius: 5 },
  loadingText: { textAlign: 'center', marginTop: 20, color: '#999' },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
    width: 40,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 18 }
});